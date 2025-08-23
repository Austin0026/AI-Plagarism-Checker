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
import {cosineSimilarity} from '@/lib/cosine-similarity';

const CalculateSimilarityInputSchema = z.object({
  text1: z.string().describe('The first text input.'),
  text2: z.string().describe('The second text input.'),
});
export type CalculateSimilarityInput = z.infer<typeof CalculateSimilarityInputSchema>;

const CalculateSimilarityOutputSchema = z.object({
  similarityScore: z.number().describe('The cosine similarity score between the two texts.'),
});
export type CalculateSimilarityOutput = z.infer<typeof CalculateSimilarityOutputSchema>;

export async function calculateSimilarity(input: CalculateSimilarityInput): Promise<CalculateSimilarityOutput> {
  return calculateSimilarityFlow(input);
}

const calculateSimilarityFlow = ai.defineFlow(
  {
    name: 'calculateSimilarityFlow',
    inputSchema: CalculateSimilarityInputSchema,
    outputSchema: CalculateSimilarityOutputSchema,
  },
  async input => {
    // Embeddings generation using a simple text generation model for demonstration purposes.
    // In a real-world scenario, Sentence-BERT or other embedding models would be used.
    const embeddingPrompt = ai.definePrompt({
      name: 'embeddingPrompt',
      input: {schema: z.string()},
      output: {schema: z.array(z.number())},
      prompt: 'Generate a simple vector embedding (array of 3 numbers) for the following text: {{{text}}}.',
    });

    const {output: embedding1} = await embeddingPrompt({text: input.text1});
    const {output: embedding2} = await embeddingPrompt({text: input.text2});

    if (!embedding1 || !embedding2) {
      throw new Error('Failed to generate embeddings for the texts.');
    }

    // Calculate cosine similarity between embeddings
    const similarityScore = cosineSimilarity(embedding1, embedding2);

    return {similarityScore};
  }
);
