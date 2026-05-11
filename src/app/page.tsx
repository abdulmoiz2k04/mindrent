import { getFirstQuestion, getSuggestedAddOns } from "@/app/actions";
import { MindRentQuiz } from "@/components/MindRentQuiz";

export default async function Home() {
  const [firstQuestion, addOns] = await Promise.all([
    getFirstQuestion(),
    getSuggestedAddOns(),
  ]);

  return <MindRentQuiz firstQuestion={firstQuestion} addOns={addOns} />;
}
