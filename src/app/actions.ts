"use server";

import {
  MAX_QUESTIONS,
  type KitName,
  type KitProduct,
  type QuizAnswer,
  type QuizQuestion,
  type QuizResult,
  type QuizServerResponse,
} from "@/lib/quiz-types";
import { shopProducts, type ShopCategory } from "@/lib/shop-products";

const GEMINI_MODEL = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const quizQuestions: QuizQuestion[] = [
  {
    id: "current-feeling",
    step: 1,
    section: "current state",
    branch: "calm",
    inputMode: "choice",
    question: "how have you been feeling most days recently?",
    answers: [
      { option: "a", text: "overwhelmed, anxious, or tense", kit: "Calm" },
      { option: "b", text: "unmotivated or mentally scattered", kit: "Focus" },
      { option: "c", text: "low, tired, or emotionally drained", kit: "SelfCare" },
    ],
  },
  {
    id: "daily-impact",
    step: 2,
    section: "current state",
    branch: "focus",
    inputMode: "choice",
    question: "what affects your daily life the most right now?",
    answers: [
      { option: "a", text: "constant worrying or overthinking", kit: "Calm" },
      { option: "b", text: "difficulty focusing or staying productive", kit: "Focus" },
      { option: "c", text: "lack of energy or feeling emotionally down", kit: "SelfCare" },
    ],
  },
  {
    id: "sleep-quality",
    step: 3,
    section: "current state",
    branch: "selfCare",
    inputMode: "choice",
    question: "how well are you sleeping?",
    answers: [
      { option: "a", text: "poorly - i struggle to relax or fall asleep", kit: "Calm" },
      { option: "b", text: "irregular - my schedule is messy", kit: "Focus" },
      { option: "c", text: "i sleep, but still feel tired", kit: "SelfCare" },
    ],
  },
  {
    id: "stress-response",
    step: 4,
    section: "behavioral patterns",
    branch: "calm",
    inputMode: "choice",
    question: "when you feel stressed, what do you usually do?",
    answers: [
      { option: "a", text: "overthink or feel physically tense", kit: "Calm" },
      { option: "b", text: "procrastinate or avoid tasks", kit: "Focus" },
      { option: "c", text: "withdraw and isolate myself", kit: "SelfCare" },
    ],
  },
  {
    id: "productivity-now",
    step: 5,
    section: "behavioral patterns",
    branch: "focus",
    inputMode: "choice",
    question: "how would you describe your productivity right now?",
    answers: [
      { option: "a", text: "i feel too anxious to function properly", kit: "Calm" },
      { option: "b", text: "i struggle to stay consistent and focused", kit: "Focus" },
      { option: "c", text: "i don't feel motivated to even start", kit: "SelfCare" },
    ],
  },
  {
    id: "intentional-breaks",
    step: 6,
    section: "behavioral patterns",
    branch: "selfCare",
    inputMode: "choice",
    question: "how often do you take intentional breaks for yourself?",
    answers: [
      { option: "a", text: "rarely - i'm always mentally occupied", kit: "Calm" },
      { option: "b", text: "sometimes, but i feel guilty about it", kit: "Focus" },
      { option: "c", text: "i try, but i don't enjoy them much", kit: "SelfCare" },
    ],
  },
  {
    id: "need-most",
    step: 7,
    section: "needs and preferences",
    branch: "calm",
    inputMode: "choice",
    question: "what do you feel you need the most right now?",
    answers: [
      { option: "a", text: "calmness and mental relief", kit: "Calm" },
      { option: "b", text: "structure and productivity", kit: "Focus" },
      { option: "c", text: "emotional comfort and self-care", kit: "SelfCare" },
    ],
  },
  {
    id: "helpful-activity",
    step: 8,
    section: "needs and preferences",
    branch: "focus",
    inputMode: "choice",
    question: "which activity sounds most helpful to you?",
    answers: [
      { option: "a", text: "deep breathing, relaxation, or calming rituals", kit: "Calm" },
      { option: "b", text: "planning my day and staying organized", kit: "Focus" },
      { option: "c", text: "journaling, skincare, or relaxing activities", kit: "SelfCare" },
    ],
  },
  {
    id: "support-preference",
    step: 9,
    section: "needs and preferences",
    branch: "selfCare",
    inputMode: "choice",
    question: "what kind of support do you prefer?",
    answers: [
      { option: "a", text: "something that helps reduce anxiety quickly", kit: "Calm" },
      { option: "b", text: "something that helps me stay on track", kit: "Focus" },
      { option: "c", text: "something that improves my mood and energy", kit: "SelfCare" },
    ],
  },
  {
    id: "routine-context",
    step: 10,
    section: "lifestyle context",
    branch: "calm",
    inputMode: "choice",
    question: "what best describes your current routine?",
    answers: [
      { option: "a", text: "busy but mentally overwhelming", kit: "Calm" },
      { option: "b", text: "unstructured and inconsistent", kit: "Focus" },
      { option: "c", text: "slow, low-energy, or draining", kit: "SelfCare" },
    ],
  },
];

const categoryByKit: Record<KitName, ShopCategory> = {
  Calm: "calm",
  Focus: "focus",
  SelfCare: "selfCare",
};

const kitLabels: Record<KitName, string> = {
  Calm: "Calm Kit",
  Focus: "Focus & Productivity Kit",
  SelfCare: "Self-Care & Mood Boost Kit",
};

const kitReasons: Record<KitName, string> = {
  Calm:
    "based on your responses, you may be experiencing stress, anxiety, or mental overload. we recommend the calm kit to help you relax, reset, and regain control.",
  Focus:
    "based on your responses, your biggest need seems to be structure, focus, and task execution. we recommend the focus & productivity kit to help you restart with clearer steps.",
  SelfCare:
    "based on your responses, you may be feeling low, tired, or emotionally drained. we recommend the self-care & mood boost kit to help you feel comforted and replenished.",
};

function toKitProduct(product: (typeof shopProducts)[number]): KitProduct {
  return {
    id: product.id,
    name: product.name,
    reason: product.description,
    price: product.price,
  };
}

function countAnswers(transcript: QuizAnswer[]) {
  return transcript.reduce(
    (counts, answer) => {
      const kit =
        answer.option === "custom" ? inferKitFromText(answer.answer) : answer.kit;

      return {
        ...counts,
        [kit]: counts[kit] + 1,
      };
    },
    { Calm: 0, Focus: 0, SelfCare: 0 } satisfies Record<KitName, number>,
  );
}

function inferKitFromText(text: string): KitName {
  const normalized = text.toLowerCase();
  const scores: Record<KitName, number> = {
    Calm: 0,
    Focus: 0,
    SelfCare: 0,
  };

  [
    /anxious|anxiety|panic|worry|overthinking|tense|stress|overwhelmed|restless|relax|calm/,
    /sleep|headache|pressure|breath|breathing|mental overload/,
  ].forEach((pattern) => {
    if (pattern.test(normalized)) {
      scores.Calm += 1;
    }
  });

  [
    /focus|productive|productivity|task|deadline|procrastinate|plan|planning|consistent|structure/,
    /organize|organized|routine|track|unfinished|motivat/,
  ].forEach((pattern) => {
    if (pattern.test(normalized)) {
      scores.Focus += 1;
    }
  });

  [
    /tired|drained|low|sad|mood|burnout|burnt|comfort|self care|self-care|skincare/,
    /lonely|isolate|numb|energy|happy|balanced|replenish/,
  ].forEach((pattern) => {
    if (pattern.test(normalized)) {
      scores.SelfCare += 1;
    }
  });

  return chooseKit(scores);
}

function chooseKit(counts: Record<KitName, number>): KitName {
  const { Calm, Focus, SelfCare } = counts;
  const max = Math.max(Calm, Focus, SelfCare);
  const leaders = (Object.keys(counts) as KitName[]).filter(
    (kit) => counts[kit] === max,
  );

  if (leaders.length === 1) {
    return leaders[0];
  }

  if (leaders.includes("Calm") && leaders.includes("Focus")) {
    return "Calm";
  }

  if (leaders.includes("Focus") && leaders.includes("SelfCare")) {
    return "Focus";
  }

  if (leaders.includes("Calm") && leaders.includes("SelfCare")) {
    return "SelfCare";
  }

  return "Calm";
}

function buildFallbackResult(transcript: QuizAnswer[]): QuizResult {
  const counts = countAnswers(transcript);
  const kit = chooseKit(counts);
  const products = shopProducts
    .filter((product) => product.category === categoryByKit[kit])
    .map(toKitProduct);

  return {
    kit,
    reasoning: kitReasons[kit],
    products,
  };
}

function isKitName(value: unknown): value is KitName {
  return value === "Calm" || value === "Focus" || value === "SelfCare";
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
      systemInstruction: {
        parts: [
          {
            text: "You are MindRent's recommendation engine. You do not diagnose. You use quiz choices and custom written answers to choose the most fitting wellness kit. Return JSON only.",
          },
        ],
      },
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.35,
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

function buildAiPrompt(transcript: QuizAnswer[], sessionId: string) {
  const counts = countAnswers(transcript);

  return `Session: ${sessionId.slice(0, 12)}

MindRent has 3 kits:
- Calm: stress, anxiety relief, mental overload, overthinking, physical tension, sleep trouble. Products: breathing cards, lavender scented candle, chamomile tea, guided journal, fidget tools, dark chocolate.
- Focus: productivity, structure, task execution, procrastination, consistency. Products: pomodoro timer, to-do planner pad, motivation stickers, granola bars, affirmation cards, acrylic paints, small brush and canvas, chamomile tea, key chain.
- SelfCare: low mood, fatigue, emotional burnout, comfort, mood boost, self-care. Products: sheet face mask, scented candle, gratitude journal, sleep mask, energy bars, peppermint green tea.

The fixed A/B/C score is:
${JSON.stringify(counts, null, 2)}

Tie-breakers:
- Calm + Focus tie -> Calm
- Focus + SelfCare tie -> Focus
- Calm + SelfCare tie -> SelfCare

Important:
- Custom answers may override the fixed score when they reveal a stronger real need.
- Read the user's custom text carefully.
- Choose exactly one kit: Calm, Focus, or SelfCare.
- Return JSON only:
{
  "kit": "Calm" | "Focus" | "SelfCare",
  "reasoning": "warm lowercase explanation in one or two sentences"
}

Transcript:
${JSON.stringify(transcript, null, 2)}`;
}

async function buildResult(transcript: QuizAnswer[], sessionId: string) {
  const fallback = buildFallbackResult(transcript);
  const text = await askGemini(buildAiPrompt(transcript, sessionId));
  const parsed = safeJson<Partial<Pick<QuizResult, "kit" | "reasoning">>>(
    text ?? "",
  );

  if (process.env.NODE_ENV === "development") {
    console.log("[mindrent quiz] ai recommendation", text);
  }

  if (!isKitName(parsed?.kit)) {
    return fallback;
  }

  const kit = parsed.kit;

  return {
    kit,
    reasoning: parsed.reasoning ?? fallback.reasoning,
    products: shopProducts
      .filter((product) => product.category === categoryByKit[kit])
      .map(toKitProduct),
  };
}

export async function getFirstQuestion(): Promise<QuizQuestion> {
  return quizQuestions[0];
}

export async function continueQuiz(input: {
  transcript: QuizAnswer[];
  sessionId: string;
}): Promise<QuizServerResponse> {
  const transcript = input.transcript.slice(0, MAX_QUESTIONS);

  if (process.env.NODE_ENV === "development") {
    console.log("[mindrent quiz] scored answers", countAnswers(transcript));
  }

  if (transcript.length >= MAX_QUESTIONS) {
    return {
      status: "result",
      result: await buildResult(transcript, input.sessionId),
    };
  }

  return { status: "question", question: quizQuestions[transcript.length] };
}

export async function getSuggestedAddOns() {
  return shopProducts.map(toKitProduct);
}

export async function getKitLabels() {
  return kitLabels;
}
