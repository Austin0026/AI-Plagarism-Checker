"use server";

import { calculateSimilarity } from "@/ai/flows/calculate-similarity";
import { generateQuiz, GenerateQuizOutput } from "@/ai/flows/generate-quiz";
import { z } from "zod";
import fs from 'fs/promises';
import path from 'path';

// Define the path for the mock database file
const dbPath = path.join(process.cwd(), 'src', 'lib', 'quiz-data.json');

// Type for the quiz data structure in the JSON file
type QuizDatabase = {
  [code: string]: GenerateQuizOutput & { topic: string };
};

// Function to read the mock database
async function readDb(): Promise<QuizDatabase> {
  try {
    await fs.access(dbPath);
    const data = await fs.readFile(dbPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If the file doesn't exist, return an empty object
    return {};
  }
}

// Function to write to the mock database
async function writeDb(data: QuizDatabase): Promise<void> {
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf-8');
}


const PlagiarismCheckSchema = z.object({
  text1: z.string(),
  text2: z.string(),
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
    // For student quiz, empty answers are fine, so don't return an error.
    if (formData.get('text1') === null || formData.get('text2') === null) {
      return { score: 0, reason: "No input provided." };
    }
    return {
      error: fieldErrors.text1?.[0] 
          || fieldErrors.text2?.[0]
          || "Invalid input provided."
    };
  }
  
  const { text1, text2 } = validatedFields.data;
  
  // If either text is very short or empty, it's not plagiarism.
  if (text1.length < 10 || text2.length < 10) {
    return { score: 0, reason: 'One or both texts were too short for a meaningful comparison.' };
  }

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
  topic?: string;
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
      return { quiz, topic };
    }
    return { error: "Failed to generate a quiz from the provided content." };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
    return { error: `An unexpected error occurred: ${errorMessage}` };
  }
}

// Action to save a quiz to the mock database
export async function saveQuiz(quizData: GenerateQuizOutput & { topic: string }): Promise<{ code?: string; error?: string }> {
  try {
    const db = await readDb();
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    db[code] = quizData;
    await writeDb(db);
    return { code };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
    return { error: `Failed to save quiz: ${errorMessage}` };
  }
}

// Action to get a quiz from the mock database
export async function getQuiz(code: string): Promise<(GenerateQuizOutput & { topic: string }) | null> {
  try {
    const db = await readDb();
    return db[code] || null;
  } catch (e) {
    console.error(e);
    return null;
  }
}
