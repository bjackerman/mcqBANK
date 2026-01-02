import { promises as fs } from "fs";
import path from "path";
import type { QuestionJson } from "./types";

const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "questions.json");

async function ensureDataFile() {
  await fs.mkdir(dataDir, { recursive: true });
  try {
    await fs.access(dataFile);
  } catch {
    await fs.writeFile(dataFile, "[]", "utf-8");
  }
}

export async function readJsonQuestions(): Promise<QuestionJson[]> {
  await ensureDataFile();
  const raw = await fs.readFile(dataFile, "utf-8");
  try {
    const parsed = JSON.parse(raw) as QuestionJson[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function writeJsonQuestions(questions: QuestionJson[]) {
  await ensureDataFile();
  await fs.writeFile(dataFile, JSON.stringify(questions, null, 2), "utf-8");
}
