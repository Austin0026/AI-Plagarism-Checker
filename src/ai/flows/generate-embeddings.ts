'use server';
/**
 * @fileOverview Generates sentence embeddings for similarity analysis using Sentence-BERT.
 *
 * - generateEmbeddings - A function that generates embeddings for a given text.
 * - GenerateEmbeddingsInput - The input type for the generateEmbeddings function.
 * - GenerateEmbeddingsOutput - The return type for the generateEmbeddings function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateEmbeddingsInputSchema = z.object({
  text: z.string().describe('The text to generate embeddings for.'),
});
export type GenerateEmbeddingsInput = z.infer<typeof GenerateEmbeddingsInputSchema>;

const GenerateEmbeddingsOutputSchema = z.object({
  embeddings: z.array(z.number()).describe('The sentence embeddings for the input text.'),
});
export type GenerateEmbeddingsOutput = z.infer<typeof GenerateEmbeddingsOutputSchema>;

export async function generateEmbeddings(input: GenerateEmbeddingsInput): Promise<GenerateEmbeddingsOutput> {
  return generateEmbeddingsFlow(input);
}

const generateEmbeddingsPrompt = ai.definePrompt({
  name: 'generateEmbeddingsPrompt',
  input: {schema: GenerateEmbeddingsInputSchema},
  output: {schema: GenerateEmbeddingsOutputSchema},
  prompt: `Generate sentence embeddings for the following text using Sentence-BERT:

{{{text}}}

Return the embeddings as a JSON array of numbers.`, // Explicit instruction for JSON output
});

const generateEmbeddingsFlow = ai.defineFlow(
  {
    name: 'generateEmbeddingsFlow',
    inputSchema: GenerateEmbeddingsInputSchema,
    outputSchema: GenerateEmbeddingsOutputSchema,
  },
  async input => {
    const {output} = await generateEmbeddingsPrompt(input);
    return output!;
  }
);
