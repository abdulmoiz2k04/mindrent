"use server";

import crypto from "node:crypto";
import {
  MAX_QUESTIONS,
  type Branch,
  type KitName,
  type KitProduct,
  type QuizAnswer,
  type QuizQuestion,
  type QuizResult,
  type QuizServerResponse,
} from "@/lib/quiz-types";

const GEMINI_MODEL = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const productCatalog: KitProduct[] = [
  {
    id: "guided-journal",
    name: "guided journal",
    reason: "turns noisy thoughts into one calm page",
    price: 1450,
  },
  {
    id: "sleep-tea",
    name: "night reset tea",
    reason: "pairs with a softer evening wind-down",
    price: 950,
  },
  {
    id: "focus-cards",
    name: "focus prompt cards",
    reason: "helps break work into tiny next steps",
    price: 1200,
  },
  {
    id: "weighted-eye-pillow",
    name: "weighted eye pillow",
    reason: "adds body-level calm without screens",
    price: 1800,
  },
  {
    id: "calming-candle",
    name: "calming candle",
    reason: "creates a clear ritual boundary",
    price: 1650,
  },
  {
    id: "breathing-stone",
    name: "breathing stone",
    reason: "gives anxious hands something steady",
    price: 1100,
  },
  {
    id: "gratitude-notes",
    name: "gratitude notes",
    reason: "makes care feel giftable and concrete",
    price: 850,
  },
  {
    id: "desk-timer",
    name: "soft desk timer",
    reason: "supports focus without phone checking",
    price: 2100,
  },
];

const firstQuestion: QuizQuestion = {
  id: "start-day",
  step: 1,
  question: "how has your day been so far?",
  branch: "selfCare",
  inputMode: "slider",
  answers: ["heavy and noisy", "scattered but manageable", "quietly okay"],
};

function stableId(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 42);
}

function inferBranch(transcript: QuizAnswer[]): Branch {
  const joined = transcript
    .map((item) => `${item.question} ${item.answer}`)
    .join(" ")
    .toLowerCase();

  if (/deadline|focus|scattered|productive|work|task|drift/.test(joined)) {
    return "productivity";
  }

  if (/tired|care|sleep|body|gentle|alone|reset/.test(joined)) {
    return "selfCare";
  }

  return "stress";
}

function inferKit(branch: Branch, transcript: QuizAnswer[]): KitName {
  const average =
    transcript.reduce((total, item) => total + item.score, 0) /
    Math.max(transcript.length, 1);

  if (branch === "productivity") {
    return "Focus";
  }

  if (branch === "selfCare" && average > 62) {
    return "Gift";
  }

  return "Basic";
}

function safeJson<T>(text: string): T | null {
  const cleaned = text
    .trim()
    .replace(/^```json/i, "")
    .replace(/^```/, "")
    .replace(/```$/, "")
    .trim();

  try {
    return JSON.parse(cleaned) as T;
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);

    if (!match) {
      return null;
    }

    try {
      return JSON.parse(match[0]) as T;
    } catch {
      return null;
    }
  }
}

function normalizeQuestion(
  value: Partial<QuizQuestion> | null,
  transcript: QuizAnswer[],
): QuizQuestion {
  const branch = value?.branch ?? inferBranch(transcript);
  const step = Math.min(transcript.length + 1, MAX_QUESTIONS);
  const answers = Array.isArray(value?.answers)
    ? value.answers.slice(0, 3)
    : fallbackQuestion(transcript).answers;

  while (answers.length < 3) {
    answers.push(fallbackQuestion(transcript).answers[answers.length]);
  }

  return {
    id: value?.id ?? `${branch}-${step}`,
    step,
    question:
      value?.question ??
      "what would feel most relieving to change in the next twenty-four hours?",
    branch,
    inputMode: value?.inputMode === "priority" ? "priority" : "slider",
    answers: answers as [string, string, string],
  };
}

function normalizeProducts(products: Partial<KitProduct>[] | undefined) {
  const cleanProducts =
    products
      ?.map((item) => ({
        id: item.id ?? stableId(item.name ?? ""),
        name: item.name ?? "",
        reason: item.reason ?? "supports your personalized reset",
        price: Number(item.price) || 1200,
      }))
      .filter((item) => item.id && item.name)
      .slice(0, 7) ?? [];

  return cleanProducts.length >= 5 ? cleanProducts : productCatalog.slice(0, 6);
}

function normalizeResult(
  value: Partial<QuizResult> | null,
  transcript: QuizAnswer[],
): QuizResult {
  const branch = inferBranch(transcript);
  const kit = value?.kit ?? inferKit(branch, transcript);

  return {
    kit,
    reasoning:
      value?.reasoning ??
      "your answers suggest you need a small reset that lowers mental load without asking for a big lifestyle overhaul.",
    products: normalizeProducts(value?.products),
  };
}

function fallbackQuestion(transcript: QuizAnswer[]): QuizQuestion {
  const branch = inferBranch(transcript);
  const step = Math.min(transcript.length + 1, MAX_QUESTIONS);
  const branchCopy: Record<Branch, QuizQuestion> = {
    stress: {
      id: `stress-${step}`,
      step,
      branch,
      inputMode: step % 2 === 0 ? "priority" : "slider",
      question: "where does the pressure usually land first?",
      answers: ["in my thoughts", "in my body", "in my sleep"],
    },
    productivity: {
      id: `focus-${step}`,
      step,
      branch,
      inputMode: step % 2 === 0 ? "priority" : "slider",
      question: "what most often breaks your focus?",
      answers: ["too many tasks", "phone checking", "low energy"],
    },
    selfCare: {
      id: `care-${step}`,
      step,
      branch,
      inputMode: step % 2 === 0 ? "priority" : "slider",
      question: "what kind of care feels easiest to accept right now?",
      answers: ["something physical", "something reflective", "something restful"],
    },
  };

  return branchCopy[branch];
}

function fallbackResult(transcript: QuizAnswer[]): QuizResult {
  const branch = inferBranch(transcript);
  const kit = inferKit(branch, transcript);
  const productsByKit: Record<KitName, KitProduct[]> = {
    Basic: productCatalog.filter((item) =>
      [
        "guided-journal",
        "sleep-tea",
        "weighted-eye-pillow",
        "breathing-stone",
        "calming-candle",
      ].includes(item.id),
    ),
    Focus: productCatalog.filter((item) =>
      [
        "focus-cards",
        "desk-timer",
        "guided-journal",
        "breathing-stone",
        "sleep-tea",
      ].includes(item.id),
    ),
    Gift: productCatalog.filter((item) =>
      [
        "calming-candle",
        "gratitude-notes",
        "weighted-eye-pillow",
        "sleep-tea",
        "guided-journal",
        "breathing-stone",
      ].includes(item.id),
    ),
  };

  return {
    kit,
    reasoning:
      branch === "productivity"
        ? "you seem to be carrying focus friction and task pressure, especially when small distractions stack up."
        : branch === "stress"
          ? "you are experiencing stress and overthinking, with your nervous system asking for a quieter reset."
          : "your answers point toward depleted self-care capacity, so the box leans into gentle rituals that are easy to start.",
    products: productsByKit[kit],
  };
}

async function askGemini(prompt: string) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return null;
  }

  const response = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.65,
        responseMimeType: "application/json",
      },
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };

  return payload.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
}

function buildQuestionPrompt(transcript: QuizAnswer[], sessionId: string) {
  const pseudonymousSession = crypto
    .createHash("sha256")
    .update(sessionId)
    .digest("hex")
    .slice(0, 16);

  return `You are MindRent's careful onboarding psychologist and product curator.
Do not diagnose. Do not mention therapy replacement. Use lowercase, warm language.
The user's session is pseudonymous: ${pseudonymousSession}.

Branch rules:
- Path A Stress tendency: choose this if answers mention pressure, overthinking, nighttime rumination, body tension, panic, or emotional load.
- Path B Productivity issues: choose this if answers mention focus, procrastination, scattered work, deadlines, phone checking, or executive friction.
- Path C Self-care needs: choose this if answers mention low energy, loneliness, rest, sleep, self-kindness, burnout, or needing gentle rituals.

The quiz has a strict maximum of ${MAX_QUESTIONS} questions. The first question was hardcoded by the app. Generate only the next question.
Return JSON only:
{
  "id": "short-kebab-id",
  "step": ${Math.min(transcript.length + 1, MAX_QUESTIONS)},
  "branch": "stress" | "productivity" | "selfCare",
  "inputMode": "slider" | "priority",
  "question": "one concise question",
  "answers": ["choice one", "choice two", "choice three"]
}

Transcript:
${JSON.stringify(transcript, null, 2)}`;
}

function buildResultPrompt(transcript: QuizAnswer[], sessionId: string) {
  const pseudonymousSession = crypto
    .createHash("sha256")
    .update(sessionId)
    .digest("hex")
    .slice(0, 16);

  return `You are MindRent's AI product curator.
The user's session is pseudonymous: ${pseudonymousSession}.
Use their quiz transcript to recommend one kit and products for a one-time mental wellness reset box.
Do not diagnose. Do not use medical claims. Keep language specific and calming.

Recommended kit rules:
- Basic: stress relief, overthinking, sleep support, gentle reset.
- Focus: productivity, attention, procrastination, work pressure.
- Gift: self-care, emotional care, replenishment, or a soothing gift-like box.

Return JSON only:
{
  "kit": "Basic" | "Focus" | "Gift",
  "reasoning": "personalized reason in one or two sentences",
  "products": [
    { "id": "short-kebab-id", "name": "product name", "reason": "why it belongs", "price": 1200 }
  ]
}
Products must contain 5 to 7 physical products. Prices must be Pakistani rupees as integers.

Transcript:
${JSON.stringify(transcript, null, 2)}`;
}

export async function getFirstQuestion(): Promise<QuizQuestion> {
  return firstQuestion;
}

export async function continueQuiz(input: {
  transcript: QuizAnswer[];
  sessionId: string;
}): Promise<QuizServerResponse> {
  const transcript = input.transcript.slice(0, MAX_QUESTIONS);

  if (transcript.length >= MAX_QUESTIONS) {
    const text = await askGemini(buildResultPrompt(transcript, input.sessionId));
    const result = text
      ? normalizeResult(safeJson<Partial<QuizResult>>(text), transcript)
      : fallbackResult(transcript);

    return { status: "result", result };
  }

  const text = await askGemini(buildQuestionPrompt(transcript, input.sessionId));
  const question = normalizeQuestion(
    safeJson<Partial<QuizQuestion>>(text ?? ""),
    transcript,
  );

  return { status: "question", question };
}

export async function getSuggestedAddOns() {
  return productCatalog;
}
