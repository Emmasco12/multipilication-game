
export interface Score {
  correct: number;
  incorrect: number;
}

export interface Problem {
  num1: number;
  num2: number;
  answer: number;
}

export interface HistoryEntry {
  problem: string;
  userAnswer: string;
  correctAnswer: number;
  isCorrect: boolean;
}
