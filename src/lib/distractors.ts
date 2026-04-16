import { Question } from "@/data/types";

/**
 * Generate an MC question from any question type.
 *
 * For multiple_choice questions: use the existing options.
 * For flashcard questions: generate 3 distractors from other cards,
 *   prioritizing same-domain distractors.
 */
export interface MCChoice {
  text: string;
  isCorrect: boolean;
}

export interface MCVariant {
  questionId: string;
  prompt: string;
  domain: string;
  choices: MCChoice[];
  explanation: string;
  correctAnswer: string;
  isGenerated: boolean; // true if distractors were synthesized
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function truncate(text: string, maxLen = 120): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen - 1).trim() + "…";
}

/**
 * Pick distractors for a flashcard-type question.
 *
 * Strategy:
 * 1. Collect candidate answers from OTHER questions (never the same one)
 * 2. Prefer same-domain first (more plausible)
 * 3. Fall back to cross-domain if not enough same-domain candidates
 * 4. Never duplicate the correct answer
 */
function pickDistractors(
  current: Question,
  allQuestions: Question[],
  count: number
): string[] {
  const others = allQuestions.filter((q) => q.id !== current.id);
  const sameDomain = others.filter((q) => q.domain === current.domain);
  const crossDomain = others.filter((q) => q.domain !== current.domain);

  // Collect candidate answer strings
  const sameDomainAnswers = shuffle(sameDomain.map((q) => q.correct_answer));
  const crossDomainAnswers = shuffle(crossDomain.map((q) => q.correct_answer));

  const chosen = new Set<string>();
  chosen.add(current.correct_answer); // never match the real answer

  const result: string[] = [];

  // Pull from same domain first
  for (const ans of sameDomainAnswers) {
    if (result.length >= count) break;
    if (chosen.has(ans)) continue;
    chosen.add(ans);
    result.push(ans);
  }

  // Fill remainder from cross-domain
  for (const ans of crossDomainAnswers) {
    if (result.length >= count) break;
    if (chosen.has(ans)) continue;
    chosen.add(ans);
    result.push(ans);
  }

  return result;
}

/**
 * Turn any question into an MC variant with 4 shuffled choices.
 */
export function generateMCVariant(
  question: Question,
  allQuestions: Question[]
): MCVariant {
  let choices: MCChoice[];
  let isGenerated = false;

  if (question.type === "multiple_choice" && question.options.length > 0) {
    // Use existing options, shuffled
    choices = shuffle(
      question.options.map((opt) => ({
        text: opt,
        isCorrect: opt === question.correct_answer,
      }))
    );
  } else {
    // Flashcard — generate 3 distractors
    isGenerated = true;
    const distractors = pickDistractors(question, allQuestions, 3);

    // If we couldn't get enough distractors, pad with generic alternatives
    while (distractors.length < 3) {
      distractors.push(`Option ${distractors.length + 1}`);
    }

    const allAnswers = [
      { text: question.correct_answer, isCorrect: true },
      ...distractors.map((d) => ({ text: d, isCorrect: false })),
    ];
    choices = shuffle(allAnswers);
  }

  // Truncate very long answer text to keep buttons usable
  choices = choices.map((c) => ({
    ...c,
    text: truncate(c.text, 200),
  }));

  return {
    questionId: question.id,
    prompt: question.prompt,
    domain: question.domain,
    choices,
    explanation: question.explanation,
    correctAnswer: question.correct_answer,
    isGenerated,
  };
}
