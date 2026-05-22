import { getFirstQuestion } from "@/app/actions";
import { MindRentQuiz } from "@/components/MindRentQuiz";

export default async function Home() {
  const firstQuestion = await getFirstQuestion();

  return <MindRentQuiz firstQuestion={firstQuestion} />;
}
