import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import type { NewQuestion, QuestionQuery, QuestionRecord, QuestionStore, QuestionUpdate } from "./question-store";

const DEFAULT_FILE_PATH = path.join(process.cwd(), "data", "questions.json");

class Mutex {
  private queue: Promise<void> = Promise.resolve();

  async runExclusive<T>(task: () => Promise<T>): Promise<T> {
    let release: () => void = () => undefined;
    const previous = this.queue;
    this.queue = new Promise<void>((resolve) => {
      release = resolve;
    });
    await previous;

    try {
      return await task();
    } finally {
      release();
    }
  }
}

export class JsonQuestionStore implements QuestionStore {
  private readonly filePath: string;
  private readonly mutex = new Mutex();

  constructor(filePath: string = DEFAULT_FILE_PATH) {
    this.filePath = filePath;
  }

  async insertMany(questions: NewQuestion[]): Promise<string[]> {
    if (questions.length === 0) {
      return [];
    }

    return this.mutex.runExclusive(async () => {
      const existing = await this.readAll();
      const now = new Date();
      const created: QuestionRecord[] = questions.map((question) => ({
        id: randomUUID(),
        questionText: question.questionText,
        options: question.options,
        correctAnswer: question.correctAnswer ?? null,
        category: question.category,
        difficulty: question.difficulty,
        status: question.status,
        source: question.source,
        createdAt: question.createdAt ?? now,
      }));

      const updated = [...existing, ...created];
      await this.writeAll(updated);
      return created.map((question) => question.id);
    });
  }

  async find(query: QuestionQuery = {}): Promise<QuestionRecord[]> {
    return this.mutex.runExclusive(async () => {
      const existing = await this.readAll();
      return existing.filter((question) => {
        if (query.id && question.id !== query.id) {
          return false;
        }
        if (query.status && question.status !== query.status) {
          return false;
        }
        if (query.category && question.category !== query.category) {
          return false;
        }
        if (query.source && question.source !== query.source) {
          return false;
        }
        return true;
      });
    });
  }

  async update(id: string, updates: QuestionUpdate): Promise<void> {
    await this.mutex.runExclusive(async () => {
      const existing = await this.readAll();
      const index = existing.findIndex((question) => question.id === id);
      if (index === -1) {
        return;
      }

      existing[index] = {
        ...existing[index],
        ...updates,
      };
      await this.writeAll(existing);
    });
  }

  private async readAll(): Promise<QuestionRecord[]> {
    try {
      const raw = await fs.readFile(this.filePath, "utf8");
      const parsed = JSON.parse(raw) as Array<Omit<QuestionRecord, "createdAt"> & { createdAt: string }>;
      return parsed.map((question) => ({
        ...question,
        createdAt: new Date(question.createdAt),
      }));
    } catch (error) {
      if (error instanceof Error && "code" in error && (error as NodeJS.ErrnoException).code === "ENOENT") {
        return [];
      }
      throw error;
    }
  }

  private async writeAll(questions: QuestionRecord[]): Promise<void> {
    await fs.mkdir(path.dirname(this.filePath), { recursive: true });
    const serialized = questions.map((question) => ({
      ...question,
      createdAt: question.createdAt.toISOString(),
    }));
    await fs.writeFile(this.filePath, JSON.stringify(serialized, null, 2));
  }
}
