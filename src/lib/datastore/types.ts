import type { ObjectId } from "mongodb";

export type QuestionDifficulty = "Easy" | "Medium" | "Hard";
export type QuestionStatus = "ready" | "needs-review" | "flagged-for-review";
export type QuestionSource = "docx" | "manual" | "import" | string;

export interface QuestionDocument {
  _id: ObjectId;
  questionText: string;
  options: string[];
  correctAnswer: string | null;
  category: string;
  difficulty: QuestionDifficulty;
  status: QuestionStatus;
  source: QuestionSource;
  createdAt: Date;
  updatedAt: Date;
}

export type NewQuestionInput = Omit<QuestionDocument, "_id" | "createdAt" | "updatedAt"> & {
  createdAt?: Date;
  updatedAt?: Date;
};

export interface QuestionJson {
  _id: string;
  questionText: string;
  options: string[];
  correctAnswer: string | null;
  category: string;
  difficulty: QuestionDifficulty;
  status: QuestionStatus;
  source: QuestionSource;
  createdAt: string;
  updatedAt: string;
}
