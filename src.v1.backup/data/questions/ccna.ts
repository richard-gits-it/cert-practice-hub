import { Question } from "../types";

// IMPORTANT: This is a placeholder. Replace with the full 200-question ccna.ts
// you already have from the previous step. The structure is identical.
const ccnaQuestions: Question[] = [
  {
    id: "ccna-nf-001",
    cert: "ccna",
    domain: "Network Fundamentals",
    type: "multiple_choice",
    prompt: "At which OSI layer does a switch primarily operate?",
    options: ["Layer 1 (Physical)", "Layer 2 (Data Link)", "Layer 3 (Network)", "Layer 4 (Transport)"],
    correct_answer: "Layer 2 (Data Link)",
    explanation: "Switches forward frames based on MAC addresses, which is a Layer 2 function.",
  },
];

export default ccnaQuestions;
