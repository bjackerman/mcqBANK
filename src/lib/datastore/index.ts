import type { QuestionStore } from "./question-store";
import { JsonQuestionStore } from "./json-question-store";
import { MongoQuestionStore } from "./mongo-question-store";

export type { QuestionStore, QuestionQuery, QuestionRecord, QuestionUpdate, NewQuestion } from "./question-store";

export function getQuestionStore(): QuestionStore {
  if (process.env.MONGODB_URI) {
    return new MongoQuestionStore();
  }

  return new JsonQuestionStore();
}
