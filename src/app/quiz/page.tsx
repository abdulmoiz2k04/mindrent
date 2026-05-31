import { getFirstQuestion } from "@/app/actions";
import { MindRentQuiz } from "@/components/MindRentQuiz";

export default async function QuizPage() {
  const firstQuestion = await getFirstQuestion();

  return <MindRentQuiz firstQuestion={firstQuestion} />;
}
