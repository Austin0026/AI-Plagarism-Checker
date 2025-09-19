"use server";

import { calculateSimilarity } from "@/ai/flows/calculate-similarity";
import { generateQuiz, GenerateQuizOutput } from "@/ai/flows/generate-quiz";
import { z } from "zod";

const PlagiarismCheckSchema = z.object({
  text1: z.string().min(100, "Text 1 must be at least 100 characters long."),
  text2: z.string().min(100, "Text 2 must be at least 100 characters long."),
});

type PlagiarismState = {
  score?: number;
  reason?: string;
  error?: string;
};

export async function checkPlagiarism(
  prevState: PlagiarismState,
  formData: FormData
): Promise<PlagiarismState> {
  const validatedFields = PlagiarismCheckSchema.safeParse({
    text1: formData.get("text1"),
    text2: formData.get("text2"),
  });

  if (!validatedFields.success) {
    const fieldErrors = validatedFields.error.flatten().fieldErrors;
    return {
      error: fieldErrors.text1?.[0] 
          || fieldErrors.text2?.[0]
          || "Invalid input provided."
    };
  }
  
  const { text1, text2 } = validatedFields.data;

  try {
    const result = await calculateSimilarity({ text1, text2 });
    if (result && typeof result.plagiarismScore === 'number' && typeof result.reason === 'string') {
      return { score: result.plagiarismScore, reason: result.reason };
    }
    return { error: "Failed to get a valid analysis from the AI." };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
    return { error: `An unexpected error occurred: ${errorMessage}` };
  }
}


const QuizGenerationSchema = z.object({
  topic: z.string().min(3, "Topic must be at least 3 characters long."),
  content: z.string().min(200, "Content must be at least 200 characters long."),
  questionCount: z.coerce.number().min(1, "Must have at least 1 question.").max(10, "Cannot have more than 10 questions."),
});


export type QuizGenerationState = {
  quiz?: GenerateQuizOutput;
  error?: string;
};


export async function createQuiz(
  prevState: QuizGenerationState,
  formData: FormData
): Promise<QuizGenerationState> {
  const validatedFields = QuizGenerationSchema.safeParse({
    topic: formData.get("topic"),
    content: formData.get("content"),
    questionCount: formData.get("questionCount"),
  });

  if (!validatedFields.success) {
    const fieldErrors = validatedFields.error.flatten().fieldErrors;
    const error = fieldErrors.topic?.[0] 
        || fieldErrors.content?.[0]
        || fieldErrors.questionCount?.[0]
        || "Invalid input provided.";
    return { error };
  }

  const { topic, content, questionCount } = validatedFields.data;

  try {
    const quiz = await generateQuiz({ topic, content, questionCount });
    if (quiz && quiz.questions) {
      return { quiz };
    }
    return { error: "Failed to generate a quiz from the provided content." };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
    return { error: `An unexpected error occurred: ${errorMessage}` };
  }
}
