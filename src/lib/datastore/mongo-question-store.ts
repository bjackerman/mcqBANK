import { ObjectId } from "mongodb";
import { getMongoDb } from "@/lib/mongodb";
import type { NewQuestion, QuestionQuery, QuestionRecord, QuestionStore, QuestionUpdate } from "./question-store";

const COLLECTION_NAME = "questions";

function mapDocToRecord(doc: {
  _id: ObjectId;
  questionText: string;
  options: string[];
  correctAnswer: string | null;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  status: "needs-review" | "ready" | "flagged";
  source: string;
  createdAt: Date;
}): QuestionRecord {
  return {
    id: doc._id.toHexString(),
    questionText: doc.questionText,
    options: doc.options,
    correctAnswer: doc.correctAnswer ?? null,
    category: doc.category,
    difficulty: doc.difficulty,
    status: doc.status,
    source: doc.source,
    createdAt: doc.createdAt,
  };
}

export class MongoQuestionStore implements QuestionStore {
  async insertMany(questions: NewQuestion[]): Promise<string[]> {
    if (questions.length === 0) {
      return [];
    }

    const db = await getMongoDb();
    const collection = db.collection(COLLECTION_NAME);
    const now = new Date();
    const docs = questions.map((question) => ({
      questionText: question.questionText,
      options: question.options,
      correctAnswer: question.correctAnswer ?? null,
      category: question.category,
      difficulty: question.difficulty,
      status: question.status,
      source: question.source,
      createdAt: question.createdAt ?? now,
    }));

    const result = await collection.insertMany(docs);
    return Object.values(result.insertedIds).map((id) => id.toHexString());
  }

  async find(query: QuestionQuery = {}): Promise<QuestionRecord[]> {
    const db = await getMongoDb();
    const collection = db.collection(COLLECTION_NAME);
    const filter: Record<string, unknown> = {};

    if (query.id) {
      filter._id = new ObjectId(query.id);
    }
    if (query.status) {
      filter.status = query.status;
    }
    if (query.category) {
      filter.category = query.category;
    }
    if (query.source) {
      filter.source = query.source;
    }

    const docs = await collection.find(filter).toArray();
    return docs.map((doc) =>
      mapDocToRecord({
        _id: doc._id as ObjectId,
        questionText: doc.questionText as string,
        options: doc.options as string[],
        correctAnswer: (doc.correctAnswer ?? null) as string | null,
        category: doc.category as string,
        difficulty: doc.difficulty as "Easy" | "Medium" | "Hard",
        status: doc.status as "needs-review" | "ready" | "flagged",
        source: doc.source as string,
        createdAt: doc.createdAt as Date,
      }),
    );
  }

  async update(id: string, updates: QuestionUpdate): Promise<void> {
    const db = await getMongoDb();
    const collection = db.collection(COLLECTION_NAME);
    const updateDoc: Record<string, unknown> = {};

    if (updates.questionText !== undefined) {
      updateDoc.questionText = updates.questionText;
    }
    if (updates.options !== undefined) {
      updateDoc.options = updates.options;
    }
    if (updates.correctAnswer !== undefined) {
      updateDoc.correctAnswer = updates.correctAnswer;
    }
    if (updates.category !== undefined) {
      updateDoc.category = updates.category;
    }
    if (updates.difficulty !== undefined) {
      updateDoc.difficulty = updates.difficulty;
    }
    if (updates.status !== undefined) {
      updateDoc.status = updates.status;
    }
    if (updates.source !== undefined) {
      updateDoc.source = updates.source;
    }

    if (Object.keys(updateDoc).length === 0) {
      return;
    }

    await collection.updateOne({ _id: new ObjectId(id) }, { $set: updateDoc });
  }
}
