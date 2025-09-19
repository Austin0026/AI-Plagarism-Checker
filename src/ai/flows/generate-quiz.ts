'use server';
/**
 * @fileOverview Generates a quiz with questions and answers based on provided content and a topic.
 *
 * - generateQuiz - A function that creates a quiz.
 * - GenerateQuizInput - The input type for the generateQuiz function.
 * - GenerateQuizOutput - The return type for the generateQuiz function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateQuizInputSchema = z.object({
  topic: z.string().describe('The main topic or subject of the quiz.'),
  content: z.string().describe('The source text or content from which to generate the quiz questions and answers.'),
  questionCount: z.number().int().min(1).max(10).describe('The number of questions to generate for the quiz.'),
});
export type GenerateQuizInput = z.infer<typeof GenerateQuizInputSchema>;

const QuizQuestionSchema = z.object({
  question: z.string().describe('The generated quiz question.'),
  answer: z.string().describe('The correct answer to the question.'),
});

const GenerateQuizOutputSchema = z.object({
  questions: z.array(QuizQuestionSchema).describe('A list of generated questions and their answers.'),
});
export type GenerateQuizOutput = z.infer<typeof GenerateQuizOutputSchema>;

export async function generateQuiz(input: GenerateQuizInput): Promise<GenerateQuizOutput> {
  return generateQuizFlow(input);
}

const quizGenerationPrompt = ai.definePrompt({
  name: 'quizGenerationPrompt',
  input: { schema: GenerateQuizInputSchema },
  output: { schema: GenerateQuizOutputSchema },
  prompt: `You are an expert educator. Your task is to create a quiz based on the provided content.

Topic: {{{topic}}}
Number of Questions: {{{questionCount}}}

Please generate exactly {{{questionCount}}} questions and their corresponding correct answers from the following content. The questions should be relevant to the specified topic.

Content:
{{{content}}}

Format the output as a JSON object containing a "questions" array, where each element is an object with "question" and "answer" fields.
`,
});

const generateQuizFlow = ai.defineFlow(
  {
    name: 'generateQuizFlow',
    inputSchema: GenerateQuizInputSchema,
    outputSchema: GenerateQuizOutputSchema,
  },
  async (input) => {
    const { output } = await quizGenerationPrompt(input);
    if (!output) {
      throw new Error('Failed to get a response from the AI model for quiz generation.');
    }
    return output;
  }
);
