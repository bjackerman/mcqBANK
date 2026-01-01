export interface Question {
  id: string;
  questionText: string;
  options: string[];
  correctAnswer?: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  status: 'needs-review' | 'ready' | 'flagged';
  aiVerified?: boolean;
  aiReasoning?: string;
}

export interface Test {
  id: string;
  title: string;
  questions: Question[];
  createdAt: Date;
}

export interface UserAnswer {
  questionId: string;
  answer: string;
}
