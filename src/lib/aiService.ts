/**
 * Mindora AI Service
 * Primary:  Groq (Llama 3.1) — free, fast, no quota issues
 * Fallback: Gemini 2.0 Flash Lite — used if Groq key not set
 * Final:    Keyword-based responses — used if both keys are missing
 */
import { groqChat, isGroqConfigured, GROQ_CHAT_MODEL } from "@/lib/groq";
import { genAI } from "@/lib/gemini";
import type { ChatMessage } from "./chatStorage";

const SYSTEM_PROMPT =
  "You are Mindora, a compassionate AI mental wellness companion. " +
  "Be warm, empathetic, non-judgmental, and evidence-informed. " +
  "Keep responses concise (3-5 sentences) and conversational. " +
  "Never diagnose, prescribe, or replace professional mental health care. " +
  "If the user mentions self-harm or crisis, respond with compassion and direct them to crisis resources.";

const CRISIS_KEYWORDS = [
  "suicide", "kill myself", "end my life", "self-harm",
  "hurt myself", "don't want to live", "want to die",
];

function isCrisis(text: string): boolean {
  const t = text.toLowerCase();
  return CRISIS_KEYWORDS.some((kw) => t.includes(kw));
}

/** Yield a text string word-by-word to simulate streaming */
async function* yieldWords(text: string, signal?: AbortSignal): AsyncGenerator<string> {
  for (const word of text.split(" ")) {
    if (signal?.aborted) return;
    yield word + " ";
    await new Promise((r) => setTimeout(r, 22));
  }
}

/** Main AI response — Groq → Gemini → keyword fallback */
export async function* streamAIResponse(
  messages: ChatMessage[],
  signal?: AbortSignal,
): AsyncGenerator<string> {
  const last = messages[messages.length - 1];
  if (!last || last.role !== "user") return;

  // Crisis always handled locally, never sent to a model
  if (isCrisis(last.text)) {
    yield* yieldWords(
      "I hear that you're in a really difficult place right now, and I'm glad you reached out. " +
      "Please call or text 988 (Suicide & Crisis Lifeline, US) — available 24/7. " +
      "In the UK call 116 123 (Samaritans). If you are in immediate danger please call emergency services. " +
      "You matter, and trained support is available right now.",
      signal,
    );
    return;
  }

  // ── 1. Try Groq (primary) ────────────────────────────────────────────────
  if (isGroqConfigured()) {
    try {
      const groqMessages = [
        { role: "system" as const, content: SYSTEM_PROMPT },
        ...messages.slice(0, -1).map((m) => ({
          role: (m.role === "user" ? "user" : "assistant") as "user" | "assistant",
          content: m.text,
        })),
        { role: "user" as const, content: last.text },
      ];

      const reply = await groqChat(groqMessages, GROQ_CHAT_MODEL, 512);
      if (reply) {
        yield* yieldWords(reply, signal);
        return;
      }
    } catch (err) {
      console.error("🔴 Groq API error:", err);
      const errStr = String(err).toLowerCase();
      if (errStr.includes("429") || errStr.includes("rate")) {
        console.warn("⚠️  Groq rate limit hit. Free tier: 30 req/min. Falling back to Gemini.");
      }
      // Fall through to Gemini
    }
  }

  // ── 2. Try Gemini (secondary) ────────────────────────────────────────────
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
      const history = messages.slice(0, -1)
        .map((m) => `${m.role === "user" ? "User" : "Mindora"}: ${m.text}`)
        .join("\n");
      const prompt = `${SYSTEM_PROMPT}\n\n${history ? history + "\n" : ""}User: ${last.text}\nMindora:`;
      const result = await model.generateContent(prompt);
      const reply = result.response.text();
      if (reply) {
        yield* yieldWords(reply, signal);
        return;
      }
    } catch (err) {
      console.error("🔴 Gemini fallback error:", err);
    }
  }

  // ── 3. Keyword-based fallback ────────────────────────────────────────────
  console.warn("⚠️  No AI provider available. Using keyword fallback. Set VITE_GROQ_API_KEY in .env");
  yield* keywordFallback(last.text, signal);
}

async function* keywordFallback(text: string, signal?: AbortSignal): AsyncGenerator<string> {
  const t = text.toLowerCase();
  let reply: string;

  if (t.includes("anxious") || t.includes("anxiety") || t.includes("panic")) {
    reply = "Anxiety can feel really overwhelming. Let's try a quick grounding exercise — name 5 things you can see around you right now. This helps bring your nervous system back to the present. What's been triggering your anxiety?";
  } else if (t.includes("stress") || t.includes("overwhelm")) {
    reply = "It sounds like you're carrying a heavy load. Try taking a slow breath with me — inhale for 4 counts, hold for 4, exhale for 6. That can help regulate your nervous system. What's been weighing on you most?";
  } else if (t.includes("sad") || t.includes("depress") || t.includes("hopeless") || t.includes("empty")) {
    reply = "I'm really sorry you're feeling this way. Those feelings are completely valid, and you don't have to face them alone. Can you tell me a bit more about what's been going on for you lately?";
  } else if (t.includes("sleep") || t.includes("insomnia") || t.includes("can't sleep")) {
    reply = "Sleep struggles can affect absolutely everything else. A consistent sleep schedule and no screens 30 minutes before bed can make a real difference. Is there something specific that keeps your mind racing at night?";
  } else if (t.includes("lonely") || t.includes("alone") || t.includes("isolated")) {
    reply = "Loneliness is one of the most painful feelings there is, and it's more common than you might think. I'm here with you right now. What's been making you feel disconnected?";
  } else if (t.includes("hello") || t.includes("hi") || t.includes("hey") || t.includes("how are you")) {
    reply = "Hello! I'm Mindora, your mental wellness companion. I'm here to listen, support, and help you navigate whatever's on your mind. How are you feeling today?";
  } else if (t.includes("thank")) {
    reply = "You're very welcome. I'm always here for you. Is there anything else you'd like to talk through?";
  } else {
    reply = "Thank you for sharing that with me. I'm here to listen without judgment. Could you tell me a little more about what's been on your mind?";
  }

  yield* yieldWords(reply, signal);
}
