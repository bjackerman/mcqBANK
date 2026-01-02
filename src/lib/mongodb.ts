import { MongoClient } from "mongodb";

let clientPromise: Promise<MongoClient> | null = null;

export async function getMongoClient(): Promise<MongoClient> {
  if (clientPromise) {
    return clientPromise;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("Missing MONGODB_URI for MongoDB connection.");
  }

  const client = new MongoClient(uri);
  clientPromise = client.connect();
  return clientPromise;
}

export async function getMongoDb() {
  const dbName = process.env.MONGODB_DB;
  if (!dbName) {
    throw new Error("Missing MONGODB_DB for MongoDB connection.");
  }

  const client = await getMongoClient();
  return client.db(dbName);
}
