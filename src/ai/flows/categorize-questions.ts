'use server';

/**
 * @fileOverview Categorizes questions using AI to facilitate filtering and selection for test generation.
 *
 * - categorizeQuestion - A function that categorizes a question.
 * - CategorizeQuestionInput - The input type for the categorizeQuestion function.
 * - CategorizeQuestionOutput - The return type for the categorizeQuestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CategorizeQuestionInputSchema = z.object({
  questionText: z.string().describe('The text of the question to categorize.'),
});
export type CategorizeQuestionInput = z.infer<typeof CategorizeQuestionInputSchema>;

const CategorizeQuestionOutputSchema = z.object({
  category: z.string().describe('The predicted category of the question.'),
  confidence: z.number().describe('The confidence level of the categorization (0-1).'),
});
export type CategorizeQuestionOutput = z.infer<typeof CategorizeQuestionOutputSchema>;

export async function categorizeQuestion(input: CategorizeQuestionInput): Promise<CategorizeQuestionOutput> {
  return categorizeQuestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'categorizeQuestionPrompt',
  input: {schema: CategorizeQuestionInputSchema},
  output: {schema: CategorizeQuestionOutputSchema},
  prompt: `You are an expert in categorizing questions for tests.

  Given the following question, determine its category. Respond with ONLY the category name and a confidence level (0-1).

  Question: {{{questionText}}}
  `,
});

const categorizeQuestionFlow = ai.defineFlow(
  {
    name: 'categorizeQuestionFlow',
    inputSchema: CategorizeQuestionInputSchema,
    outputSchema: CategorizeQuestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
