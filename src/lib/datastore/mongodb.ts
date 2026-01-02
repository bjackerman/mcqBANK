import { MongoClient } from "mongodb";
import type { Collection, Db } from "mongodb";
import type { QuestionDocument } from "./types";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB ?? "mcqbank";

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;
let indexesEnsured = false;

async function getMongoClient() {
  if (!uri) {
    throw new Error("Missing MONGODB_URI for MongoDB connection.");
  }

  if (!cachedClient) {
    cachedClient = new MongoClient(uri);
  }

  await cachedClient.connect();

  return cachedClient;
}

export async function getMongoDb() {
  if (!cachedDb) {
    const client = await getMongoClient();
    cachedDb = client.db(dbName);
  }

  return cachedDb;
}

async function ensureQuestionIndexes(collection: Collection<QuestionDocument>) {
  if (indexesEnsured) {
    return;
  }

  await Promise.all([
    collection.createIndex({ status: 1 }),
    collection.createIndex({ category: 1 }),
    collection.createIndex({ difficulty: 1 }),
    collection.createIndex({ createdAt: -1 }),
  ]);

  indexesEnsured = true;
}

export async function getQuestionsCollection() {
  const db = await getMongoDb();
  const collection = db.collection<QuestionDocument>("questions");
  await ensureQuestionIndexes(collection);
  return collection;
}
