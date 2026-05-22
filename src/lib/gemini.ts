import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

if (!apiKey) {
  console.warn("VITE_GEMINI_API_KEY is not set — AI features will be disabled.");
}

export const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

// gemini-2.0-flash is the current stable model available in v1beta.
// gemini-2.0-flash was removed from v1beta in early 2026.
export function getModel(modelName = "gemini-2.0-flash-lite") {
  if (!genAI) throw new Error("Gemini API key is not configured.");
  return genAI.getGenerativeModel({ model: modelName });
}
