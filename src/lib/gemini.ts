import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

if (!apiKey) {
  console.warn("VITE_GEMINI_API_KEY is not set — AI features will be disabled.");
}

export const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export function getModel(modelName = "gemini-1.5-flash") {
  if (!genAI) throw new Error("Gemini API key is not configured.");
  return genAI.getGenerativeModel({ model: modelName });
}

