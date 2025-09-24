export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  createdAt: string;
}

export interface User {
  name: string;
  score: number;
  questionsAnswered: number;
  lastPlayed: string;
}

export interface QuizSession {
  currentUser: string;
  currentQuestionIndex: number;
  questions: Question[];
  sessionScore: number;
  isActive: boolean;
}