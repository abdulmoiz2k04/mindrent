export const MAX_QUESTIONS = 10;

export type Branch = "calm" | "focus" | "selfCare";

export type AnswerOption = "a" | "b" | "c" | "custom";

export type KitName = "Calm" | "Focus" | "SelfCare";

export type QuizAnswer = {
  question: string;
  answer: string;
  score: number;
  option: AnswerOption;
  kit: KitName;
};

export type QuizQuestion = {
  id: string;
  step: number;
  question: string;
  branch: Branch;
  section: string;
  inputMode: "choice";
  answers: [
    { option: "a"; text: string; kit: "Calm" },
    { option: "b"; text: string; kit: "Focus" },
    { option: "c"; text: string; kit: "SelfCare" },
  ];
};

export type KitProduct = {
  id: string;
  name: string;
  reason: string;
  price: number;
};

export type QuizResult = {
  kit: KitName;
  reasoning: string;
  products: KitProduct[];
};

export type QuizServerResponse =
  | {
      status: "question";
      question: QuizQuestion;
    }
  | {
      status: "result";
      result: QuizResult;
    };
