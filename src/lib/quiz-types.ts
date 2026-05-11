export const MAX_QUESTIONS = 5;

export type Branch = "stress" | "productivity" | "selfCare";

export type QuizAnswer = {
  question: string;
  answer: string;
  score: number;
};

export type QuizQuestion = {
  id: string;
  step: number;
  question: string;
  branch: Branch;
  inputMode: "slider" | "priority";
  answers: [string, string, string];
};

export type KitName = "Basic" | "Focus" | "Gift";

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
