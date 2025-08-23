"use server";

import { calculateSimilarity } from "@/ai/flows/calculate-similarity";
import { z } from "zod";

const PlagiarismCheckSchema = z.object({
  text1: z.string().min(100, "Text 1 must be at least 100 characters long."),
  text2: z.string().min(100, "Text 2 must be at least 100 characters long."),
});

type State = {
  score?: number;
  error?: string;
};

function calculatePlagiarismScore(cosineSim: number): number {
  let score: number;
  if (cosineSim >= 0.95) {
    score = 100; // Exact or near-exact copy
  } else if (cosineSim >= 0.75) {
    // Range 75–95% similarity → 50–99% plagiarism
    score = 50 + (cosineSim - 0.75) * 200;
  } else if (cosineSim >= 0.5) {
    // Range 50–75% similarity → 20–50% plagiarism
    score = 20 + (cosineSim - 0.5) * 60;
  } else {
    // Below 50% → low plagiarism
    score = cosineSim * 20;
  }
  return Math.round(score);
}


export async function checkPlagiarism(
  prevState: State,
  formData: FormData
): Promise<State> {
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
    if (result && typeof result.similarityScore === 'number') {
      const plagiarismScore = calculatePlagiarismScore(result.similarityScore);
      return { score: plagiarismScore };
    }
    return { error: "Failed to get a valid similarity score from the AI." };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
    return { error: `An unexpected error occurred: ${errorMessage}` };
  }
}
