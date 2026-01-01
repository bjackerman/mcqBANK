// src/ai/flows/predict-missing-answers.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for predicting missing answers in a question set.
 *
 * predictMissingAnswers - An async function that takes a question and attempts to predict its missing answer.
 * PredictMissingAnswersInput - The input type for the predictMissingAnswers function.
 * PredictMissingAnswersOutput - The output type for the predictMissingAnswers function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictMissingAnswersInputSchema = z.object({
  questionText: z.string().describe('The text of the question.'),
  options: z.array(z.string()).describe('The possible answer options for the question.'),
});
export type PredictMissingAnswersInput = z.infer<typeof PredictMissingAnswersInputSchema>;

const PredictMissingAnswersOutputSchema = z.object({
  predictedAnswer: z.string().describe('The AI-predicted answer to the question.'),
  confidence: z.number().describe('Confidence level of the predicted answer (0-1).'),
});
export type PredictMissingAnswersOutput = z.infer<typeof PredictMissingAnswersOutputSchema>;

export async function predictMissingAnswers(input: PredictMissingAnswersInput): Promise<PredictMissingAnswersOutput> {
  return predictMissingAnswersFlow(input);
}

const predictMissingAnswersPrompt = ai.definePrompt({
  name: 'predictMissingAnswersPrompt',
  input: {schema: PredictMissingAnswersInputSchema},
  output: {schema: PredictMissingAnswersOutputSchema},
  prompt: `Given the following question and its possible answers, predict the correct answer. Also, provide a confidence level (0-1) for your prediction.\n\nQuestion: {{{questionText}}}\nOptions: {{#each options}}{{{this}}}, {{/each}}\n\nPrediction:`, // Keep it simple, prediction is the key, no reasoning needed.
});

const predictMissingAnswersFlow = ai.defineFlow(
  {
    name: 'predictMissingAnswersFlow',
    inputSchema: PredictMissingAnswersInputSchema,
    outputSchema: PredictMissingAnswersOutputSchema,
  },
  async input => {
    const {output} = await predictMissingAnswersPrompt(input);
    return output!;
  }
);
