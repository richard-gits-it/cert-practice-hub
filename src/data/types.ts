export interface Question {
  id: string;
  cert: string;
  domain: string;
  type: "flashcard" | "multiple_choice";
  prompt: string;
  options: string[];
  correct_answer: string;
  explanation: string;
  /**
   * Optional CLI / command output block.
   * When present, renders as a terminal-style monospace block
   * above the prompt in both Flashcard and Exam modes.
   * Use for questions showing router/switch config, show command
   * output, ping/traceroute results, etc.
   */
  cli?: string;
}
