'use server';

/**
 * @fileOverview A flow to verify the correctness of a newly added question's answer using an LLM tool.
 *
 * - verifyNewAnswer - A function that verifies the answer to a new question.
 * - VerifyNewAnswerInput - The input type for the verifyNewAnswer function.
 * - VerifyNewAnswerOutput - The return type for the verifyNewAnswer function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VerifyNewAnswerInputSchema = z.object({
  question: z.string().describe('The question text.'),
  answer: z.string().describe('The provided answer to the question.'),
});
export type VerifyNewAnswerInput = z.infer<typeof VerifyNewAnswerInputSchema>;

const VerifyNewAnswerOutputSchema = z.object({
  isCorrect: z.boolean().describe('Whether the answer is correct according to the LLM.'),
  reasoning: z.string().describe('The LLM\s reasoning for its assessment.'),
  flagForReview: z.boolean().describe('Whether the question should be flagged for review based on answer correctness.'),
});
export type VerifyNewAnswerOutput = z.infer<typeof VerifyNewAnswerOutputSchema>;

export async function verifyNewAnswer(input: VerifyNewAnswerInput): Promise<VerifyNewAnswerOutput> {
  return verifyNewAnswerFlow(input);
}

const verifyAnswerTool = ai.defineTool(
  {
    name: 'verifyAnswer',
    description: 'Verifies if the provided answer correctly answers the question.',
    inputSchema: VerifyNewAnswerInputSchema,
    outputSchema: z.object({
      isCorrect: z.boolean().describe('true if the provided answer correctly answers the question, false otherwise'),
      reasoning: z.string().describe('The explanation of why the answer is correct or incorrect'),
    }),
  },
  async (input) => {
    const promptResult = await answerVerificationPrompt(input);
    return promptResult.output!;
  }
);

const answerVerificationPrompt = ai.definePrompt({
  name: 'answerVerificationPrompt',
  input: {schema: VerifyNewAnswerInputSchema},
  output: {
    schema: z.object({
      isCorrect: z.boolean().describe('true if the provided answer correctly answers the question, false otherwise'),
      reasoning: z.string().describe('The explanation of why the answer is correct or incorrect'),
    }),
  },
  prompt: `You are an expert fact checker. Given the following question and answer, determine if the answer is correct. Provide a detailed explanation for your reasoning.

Question: {{{question}}}
Answer: {{{answer}}}

Based on your analysis, determine if the answer is correct and provide your reasoning. Be brief and to the point.`,
});

const verifyNewAnswerFlow = ai.defineFlow(
  {
    name: 'verifyNewAnswerFlow',
    inputSchema: VerifyNewAnswerInputSchema,
    outputSchema: VerifyNewAnswerOutputSchema,
  },
  async (input) => {
    const verificationResult = await verifyAnswerTool(input);
    const flagForReview = !verificationResult.isCorrect;

    return {
      isCorrect: verificationResult.isCorrect,
      reasoning: verificationResult.reasoning,
      flagForReview: flagForReview,
    };
  }
);
