import { genAI } from "@/lib/gemini";
import type { ChatMessage } from "./chatStorage";

const SYSTEM_PROMPT = `You are Mindora, a compassionate AI companion supporting users with anxiety, stress, and emotional well-being while they await professional clinical care. Be warm, empathetic, non-judgmental, and evidence-informed.

Guidelines:
- Listen actively and reflect feelings before offering advice
- Use evidence-based techniques (CBT, mindfulness, grounding) when appropriate
- Keep responses concise and human — avoid clinical jargon
- Never diagnose, prescribe, or replace professional mental health care
- If someone expresses thoughts of self-harm or crisis, gently direct them to professional help and crisis resources (988 in the US)
- Celebrate small wins and progress
- Ask follow-up questions to understand the user's situation`;

/** Convert app chat history to the format Gemini expects */
function toGeminiHistory(messages: ChatMessage[]) {
  // Exclude the last message — it's the one we're about to send
  return messages.slice(0, -1).map((m) => ({
    role: m.role === "user" ? "user" as const : "model" as const,
    parts: [{ text: m.text }],
  }));
}

const CRISIS_KEYWORDS = [
  "suicide", "kill myself", "end my life", "self-harm",
  "hurt myself", "don't want to live", "want to die",
];

function isCrisisMessage(text: string): boolean {
  const t = text.toLowerCase();
  return CRISIS_KEYWORDS.some((kw) => t.includes(kw));
}

/** Stream the AI response token by token using Gemini */
export async function* streamAIResponse(
  messages: ChatMessage[],
  signal?: AbortSignal,
): AsyncGenerator<string> {
  const last = messages[messages.length - 1];
  if (!last || last.role !== "user") return;

  // §9 — Crisis detection: always respond with crisis message, never pass to model
  if (isCrisisMessage(last.text)) {
    const crisisReply =
      "I hear that you're in a really difficult place right now, and I'm glad you reached out. " +
      "Please call or text 988 (Suicide & Crisis Lifeline) — they are available 24/7 and truly want to help. " +
      "In the UK call 116 123 (Samaritans). If you are in immediate danger, please call emergency services. " +
      "You matter, and support is available right now.";
    for (const word of crisisReply.split(" ")) {
      yield word + " ";
      await new Promise((r) => setTimeout(r, 28));
    }
    return;
  }

  // Fall back to keyword-based responses when no API key is set
  if (!genAI) {
    yield* fallbackResponse(messages);
    return;
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: SYSTEM_PROMPT,
    });

    const chat = model.startChat({
      history: toGeminiHistory(messages),
      generationConfig: { maxOutputTokens: 1024, temperature: 0.7 },
    });

    // Use streaming so tokens appear word-by-word
    const result = await chat.sendMessageStream(last.text);

    for await (const chunk of result.stream) {
      if (signal?.aborted) return;
      const text = chunk.text();
      if (text) yield text;
    }
  } catch (err) {
    // Network error or safety block — fall back gracefully
    console.warn("Gemini stream error:", err);
    yield* fallbackResponse(messages);
  }
}

/** Keyword-based fallback when the API key is missing or a call fails */
async function* fallbackResponse(messages: ChatMessage[]): AsyncGenerator<string> {
  const text = messages[messages.length - 1]?.text?.toLowerCase() ?? "";

  const isCrisis =
    text.includes("suicide") ||
    text.includes("kill myself") ||
    text.includes("end my life") ||
    text.includes("self-harm") ||
    text.includes("hurt myself");

  let reply: string;
  if (isCrisis) {
    reply =
      "I hear that you're hurting right now. Please reach out to a crisis line — you can call or text 988 (US) any time. I'm here for you, and so are trained counselors who can help.";
  } else if (text.includes("anxious") || text.includes("anxiety") || text.includes("panic")) {
    reply =
      "Anxiety can feel overwhelming. Let's try grounding: name 5 things you can see around you right now. This brings your nervous system back to the present moment. What's making you feel anxious today?";
  } else if (text.includes("stress") || text.includes("overwhelm")) {
    reply =
      "It sounds like you're carrying a lot. Take a slow breath with me — inhale for 4 counts, hold for 4, exhale for 6. What's weighing on you most today?";
  } else if (text.includes("sad") || text.includes("depress") || text.includes("hopeless")) {
    reply =
      "I'm sorry you're feeling this way. Those feelings are valid, and you don't have to face them alone. Can you tell me a little more about what's been going on?";
  } else if (text.includes("sleep") || text.includes("insomnia") || text.includes("tired")) {
    reply =
      "Sleep struggles can affect everything. Try keeping a consistent sleep time and avoiding screens 30 minutes before bed. Is there something on your mind keeping you awake?";
  } else {
    reply =
      "Thank you for sharing that with me. I'm here to listen and support you. What's been on your mind lately?";
  }

  // Simulate streaming word-by-word
  for (const word of reply.split(" ")) {
    yield word + " ";
    await new Promise((r) => setTimeout(r, 28));
  }
}
