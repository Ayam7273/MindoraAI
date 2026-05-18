import { getModel } from "@/lib/gemini";

export async function sendChatMessage(_threadId: string, text: string): Promise<string> {
  try {
    const model = getModel();
    const chat = model.startChat({
      history: [],
      generationConfig: { maxOutputTokens: 1024, temperature: 0.7 },
      systemInstruction: `You are Mindora, a compassionate AI mental wellness companion.
Your role is to listen empathetically, offer evidence-based coping strategies, and gently
encourage users to seek professional help when needed. Never diagnose or prescribe.
Always remind users that you are an AI and not a substitute for professional mental health care.`,
    });
    const result = await chat.sendMessage(text);
    return result.response.text();
  } catch {
    return "";
  }
}
