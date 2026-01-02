export interface QuestionRecord {
  id: string;
  questionText: string;
  options: string[];
  correctAnswer: string | null;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  status: "needs-review" | "ready" | "flagged";
  source: string;
  createdAt: Date;
}

export type NewQuestion = Omit<QuestionRecord, "id" | "createdAt"> & {
  createdAt?: Date;
};

export type QuestionQuery = Partial<Pick<QuestionRecord, "id" | "status" | "category" | "source">>;

export type QuestionUpdate = Partial<Omit<QuestionRecord, "id" | "createdAt">>;

export interface QuestionStore {
  insertMany(questions: NewQuestion[]): Promise<string[]>;
  find(query?: QuestionQuery): Promise<QuestionRecord[]>;
  update(id: string, updates: QuestionUpdate): Promise<void>;
}
