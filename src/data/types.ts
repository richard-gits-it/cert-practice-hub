export interface Question {
  id: string;
  cert: string;
  domain: string;
  type: "flashcard" | "multiple_choice";
  prompt: string;
  options: string[];
  correct_answer: string;
  explanation: string;
}
