'use server';
/**
 * @fileOverview Verifies the correctness of provided answers using AI.
 *
 * - verifyAnswer - A function that verifies the correctness of provided answers.
 * - VerifyAnswerInput - The input type for the verifyAnswer function.
 * - VerifyAnswerOutput - The return type for the verifyAnswer function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VerifyAnswerInputSchema = z.object({
  question: z.string().describe('The question to be answered.'),
  answer: z.string().describe('The provided answer to the question.'),
});
export type VerifyAnswerInput = z.infer<typeof VerifyAnswerInputSchema>;

const VerifyAnswerOutputSchema = z.object({
  isCorrect: z.boolean().describe('Whether the provided answer is correct.'),
  confidence: z.number().describe('The AI confidence in its assessment (0-1).'),
  reasoning: z.string().describe('The AI reasoning for its assessment.'),
});
export type VerifyAnswerOutput = z.infer<typeof VerifyAnswerOutputSchema>;

export async function verifyAnswer(input: VerifyAnswerInput): Promise<VerifyAnswerOutput> {
  return verifyAnswerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'verifyAnswerPrompt',
  input: {schema: VerifyAnswerInputSchema},
  output: {schema: VerifyAnswerOutputSchema},
  prompt: `You are an expert fact checker. Determine if the provided answer correctly answers the question.\n\nQuestion: {{{question}}}\nProvided Answer: {{{answer}}}\n\nAssess the correctness of the answer, provide a confidence score, and explain your reasoning. Adhere to the output schema.`, 
});

const verifyAnswerFlow = ai.defineFlow(
  {
    name: 'verifyAnswerFlow',
    inputSchema: VerifyAnswerInputSchema,
    outputSchema: VerifyAnswerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
