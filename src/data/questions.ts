import { Question } from "./types";
import ccnaQuestions from "./questions/ccna";
import itec285Questions from "./questions/itec285";

const questionBanks: Record<string, Question[]> = {
  ccna: ccnaQuestions,
  itec285: itec285Questions,
};

export function getQuestions(cert: string, domain?: string, type?: string): Question[] {
  const bank = questionBanks[cert] || [];
  return bank.filter((q) => {
    if (domain && q.domain !== domain) return false;
    if (type && q.type !== type) return false;
    return true;
  });
}

export function getRandomQuestions(cert: string, count: number): Question[] {
  const bank = questionBanks[cert] || [];
  const shuffled = [...bank].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export function getMultipleChoiceQuestions(cert: string): Question[] {
  return getQuestions(cert, undefined, "multiple_choice");
}
