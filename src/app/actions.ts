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
      return { score: result.similarityScore };
    }
    return { error: "Failed to get a valid similarity score from the AI." };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
    return { error: `An unexpected error occurred: ${errorMessage}` };
  }
}
