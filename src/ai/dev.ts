import { config } from 'dotenv';
config();

import '@/ai/flows/verify-new-answer.ts';
import '@/ai/flows/predict-missing-answers.ts';
import '@/ai/flows/categorize-questions.ts';
import '@/ai/flows/verify-answers.ts';