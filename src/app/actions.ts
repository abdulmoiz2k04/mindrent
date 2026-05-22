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

const validKits: KitName[] = ["Basic", "Focus", "Gift"];

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

const kitSignals: Record<KitName, RegExp[]> = {
  Basic: [
    /heavy/,
    /noisy|noise/,
    /overwhelm/,
    /anxious|anxiety/,
    /panic/,
    /pressure/,
    /stress/,
    /ruminat|overthink/,
    /tension|tense/,
    /body/,
    /sleep|restless/,
    /too much|carrying/,
  ],
  Focus: [
    /focus/,
    /deadline/,
    /productive|productivity/,
    /work/,
    /task/,
    /procrastinat/,
    /phone|checking/,
    /distract/,
    /executive/,
    /scattered/,
    /drift/,
    /tabs?/,
  ],
  Gift: [
    /care|self-care/,
    /kindness|self-kind/,
    /gentle/,
    /alone|lonely/,
    /low energy/,
    /tired/,
    /burnout|depleted/,
    /replenish/,
    /gift/,
    /comfort/,
    /rest/,
    /soft/,
    /physical/,
    /reflective/,
  ],
};

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
  const kit = scoreTranscript(transcript).kit;

  if (kit === "Focus") {
    return "productivity";
  }

  if (kit === "Gift") {
    return "selfCare";
  }

  return "stress";
}

function inferKit(branch: Branch, transcript: QuizAnswer[]): KitName {
  const scoredKit = scoreTranscript(transcript).kit;

  if (scoredKit) {
    return scoredKit;
  }

  return branch === "productivity"
    ? "Focus"
    : branch === "selfCare"
      ? "Gift"
      : "Basic";
}

function isKitName(value: unknown): value is KitName {
  return typeof value === "string" && validKits.includes(value as KitName);
}

function scoreTranscript(transcript: QuizAnswer[]) {
  const scores: Record<KitName, number> = {
    Basic: 0,
    Focus: 0,
    Gift: 0,
  };

  transcript.forEach((item, index) => {
    const text = `${item.question} ${item.answer}`.toLowerCase();
    const answerWeight = item.score >= 67 ? 1.15 : item.score <= 33 ? 0.95 : 1;
    const recencyWeight = 1 + index * 0.04;

    validKits.forEach((kit) => {
      const signalCount = kitSignals[kit].filter((pattern) =>
        pattern.test(text),
      ).length;

      scores[kit] += signalCount * answerWeight * recencyWeight;
    });
  });

  if (scores.Basic === 0 && scores.Focus === 0 && scores.Gift === 0) {
    return { kit: "Basic" as KitName, scores };
  }

  const tieBreaker: KitName[] = ["Basic", "Gift", "Focus"];
  const kit = tieBreaker.reduce((winner, kit) =>
    scores[kit] > scores[winner] ? kit : winner,
  );

  return { kit, scores };
}

function logDev(label: string, value: unknown) {
  if (process.env.NODE_ENV === "development") {
    console.log(`[mindrent quiz] ${label}`, value);
  }
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
  const fallback = fallbackResult(transcript);

  if (!isKitName(value?.kit)) {
    return fallback;
  }

  return {
    kit: value.kit,
    reasoning: value.reasoning ?? fallback.reasoning,
    products: normalizeProducts(value?.products ?? fallback.products),
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

async function askGemini(prompt: string, systemPrompt?: string) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return null;
  }

  const body: Record<string, unknown> = {
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
    generationConfig: {
      temperature: 0.45,
      responseMimeType: "application/json",
    },
  };

  if (systemPrompt) {
    body.systemInstruction = {
      parts: [{ text: systemPrompt }],
    };
  }

  const response = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
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

function buildRecommendationSystemPrompt() {
  return `You are MindRent's kit recommendation engine.
Do not diagnose, do not make medical claims, and do not imply therapy replacement.
Your job is to analyze all 5 quiz answers holistically and choose the single MOST fitting kit. Never default to Focus just because the user mentions feeling scattered once.

The 3 kit types are:
1. Basic: the calm kit. Choose this for stress relief, emotional heaviness, anxiety, overwhelm, body tension, rumination, overstimulation, sleep trouble, or needing the world to feel quieter.
2. Focus: the productivity kit. Choose this only when the strongest overall pattern is work friction, deadlines, procrastination, phone checking, distraction, task initiation, or attention support.
3. Gift: the self-care kit. Choose this for depleted energy, loneliness, burnout, self-kindness, replenishment, comfort, rest, or when the user seems to need care that feels soft and gift-like.

Examples:
- If the user feels emotionally heavy, overwhelmed, overstimulated, or mentions noise/anxiety -> Basic.
- If the user repeatedly mentions deadlines, tasks, procrastination, phone checking, or trouble starting work -> Focus.
- If the user feels tired, lonely, burnt out, low-energy, or asks for gentle care/rest -> Gift.
- If signals conflict, count the whole transcript and pick the kit with the strongest repeated signal. A single scattered/focus word should not override heavier calm or self-care signals.

Return JSON only with this shape:
{
  "kit": "Basic" | "Focus" | "Gift",
  "reasoning": "one or two warm lowercase sentences explaining the choice",
  "products": [
    { "id": "short-kebab-id", "name": "product name", "reason": "why it belongs", "price": 1200 }
  ]
}
The kit value must be exactly one of: Basic, Focus, Gift. Products must contain 5 to 7 physical items with integer PKR prices.`;
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

  return `The user's session is pseudonymous: ${pseudonymousSession}.
Analyze these 5 quiz answers and recommend one kit. Treat answer text and slider scores as signals, but make the final decision from the whole pattern.

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

  logDev("raw quiz answers", transcript);

  if (transcript.length >= MAX_QUESTIONS) {
    const text = await askGemini(
      buildResultPrompt(transcript, input.sessionId),
      buildRecommendationSystemPrompt(),
    );
    const parsed = safeJson<Partial<QuizResult>>(text ?? "");

    logDev("raw ai recommendation response", text);

    if (!isKitName(parsed?.kit)) {
      logDev("rule-based recommendation fallback", scoreTranscript(transcript));
    }

    const result = text
      ? normalizeResult(parsed, transcript)
      : fallbackResult(transcript);

    return { status: "result", result };
  }

  const text = await askGemini(buildQuestionPrompt(transcript, input.sessionId));
  logDev("raw ai question response", text);
  const question = normalizeQuestion(
    safeJson<Partial<QuizQuestion>>(text ?? ""),
    transcript,
  );

  return { status: "question", question };
}

export async function getSuggestedAddOns() {
  return productCatalog;
}
