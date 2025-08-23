'use server';
/**
 * @fileOverview Calculates the cosine similarity between sentence embeddings.
 *
 * - calculateSimilarity - A function that calculates the cosine similarity between two text inputs.
 * - CalculateSimilarityInput - The input type for the calculateSimilarity function.
 * - CalculateSimilarityOutput - The return type for the calculateSimilarity function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CalculateSimilarityInputSchema = z.object({
  text1: z.string().describe('The original text.'),
  text2: z.string().describe('The comparison text.'),
});
export type CalculateSimilarityInput = z.infer<typeof CalculateSimilarityInputSchema>;

const CalculateSimilarityOutputSchema = z.object({
  plagiarismScore: z.number().describe('The plagiarism score from 0 to 100.'),
  reason: z.string().describe('A short explanation for the plagiarism score.'),
});
export type CalculateSimilarityOutput = z.infer<typeof CalculateSimilarityOutputSchema>;

export async function calculateSimilarity(input: CalculateSimilarityInput): Promise<CalculateSimilarityOutput> {
  return calculateSimilarityFlow(input);
}

const plagiarismPrompt = ai.definePrompt({
  name: 'plagiarismPrompt',
  input: {schema: CalculateSimilarityInputSchema},
  output: {schema: CalculateSimilarityOutputSchema},
  prompt: `You are an AI-based plagiarism checker. Compare the Original Text and the Comparison Text. Analyze them for:

- Exact Match – check if text is copied word-for-word.
- Paraphrasing – check if the meaning is the same but words are changed.
- Semantic Similarity – check if the texts convey a similar idea.

Finally, give a plagiarism score (0–100%) using this scale:
- 90–100% → Exact / near exact copy
- 70–89% → Paraphrased but meaning is preserved
- 40–69% → Partial overlap in meaning
- 0–39% → Mostly original / unrelated

Format the output as JSON with "plagiarismScore" and "reason" fields.

Original Text:
{{{text1}}}

Comparison Text:
{{{text2}}}
`,
});

const calculateSimilarityFlow = ai.defineFlow(
  {
    name: 'calculateSimilarityFlow',
    inputSchema: CalculateSimilarityInputSchema,
    outputSchema: CalculateSimilarityOutputSchema,
  },
  async input => {
    const {output} = await plagiarismPrompt(input);
    if (!output) {
      throw new Error('Failed to get a response from the AI model.');
    }
    return output;
  }
);
