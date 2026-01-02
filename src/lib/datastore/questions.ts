import { ObjectId } from "mongodb";
import { getQuestionsCollection } from "./mongodb";
import { readJsonQuestions, writeJsonQuestions } from "./json-store";
import type { NewQuestionInput, QuestionDocument, QuestionJson } from "./types";

export type InsertQuestionsResult = {
  ids: string[];
  count: number;
  backend: "mongodb" | "json";
};

function normalizeQuestionInput(input: NewQuestionInput, now: Date): QuestionDocument {
  return {
    _id: new ObjectId(),
    questionText: input.questionText,
    options: input.options,
    correctAnswer: input.correctAnswer ?? null,
    category: input.category,
    difficulty: input.difficulty,
    status: input.status,
    source: input.source,
    createdAt: input.createdAt ?? now,
    updatedAt: input.updatedAt ?? now,
  };
}

function toJsonQuestion(doc: QuestionDocument): QuestionJson {
  return {
    _id: doc._id.toHexString(),
    questionText: doc.questionText,
    options: doc.options,
    correctAnswer: doc.correctAnswer,
    category: doc.category,
    difficulty: doc.difficulty,
    status: doc.status,
    source: doc.source,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

async function insertQuestionsJson(inputs: NewQuestionInput[]): Promise<InsertQuestionsResult> {
  const existing = await readJsonQuestions();
  const now = new Date();
  const docs = inputs.map((input) => normalizeQuestionInput(input, now));
  const jsonDocs = docs.map(toJsonQuestion);

  await writeJsonQuestions([...existing, ...jsonDocs]);

  return {
    ids: jsonDocs.map((doc) => doc._id),
    count: jsonDocs.length,
    backend: "json",
  };
}

async function insertQuestionsMongo(inputs: NewQuestionInput[]): Promise<InsertQuestionsResult> {
  const collection = await getQuestionsCollection();
  const now = new Date();
  const docs = inputs.map((input) => normalizeQuestionInput(input, now));

  if (docs.length > 0) {
    await collection.insertMany(docs);
  }

  return {
    ids: docs.map((doc) => doc._id.toHexString()),
    count: docs.length,
    backend: "mongodb",
  };
}

export async function insertQuestions(inputs: NewQuestionInput[]): Promise<InsertQuestionsResult> {
  if (!process.env.MONGODB_URI) {
    return insertQuestionsJson(inputs);
  }

  try {
    return await insertQuestionsMongo(inputs);
  } catch {
    return insertQuestionsJson(inputs);
  }
}
