/**
 * Shared AI helper functions used across screens.
 * Uses Groq as primary, Gemini as fallback.
 */
import { groqChat, isGroqConfigured, GROQ_SMART_MODEL } from "@/lib/groq";
import { genAI } from "@/lib/gemini";

/** Generate any text with Groq → Gemini → null fallback */
export async function generateText(prompt: string): Promise<string | null> {
  // Try Groq first
  if (isGroqConfigured()) {
    try {
      const reply = await groqChat(
        [{ role: "user", content: prompt }],
        GROQ_SMART_MODEL,
        1024,
      );
      if (reply) return reply;
    } catch (err) {
      console.warn("Groq generateText error:", err);
    }
  }

  // Try Gemini
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
      const result = await model.generateContent(prompt);
      const reply = result.response.text();
      if (reply) return reply;
    } catch (err) {
      console.warn("Gemini generateText error:", err);
    }
  }

  return null;
}
