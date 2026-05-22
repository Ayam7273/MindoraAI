/**
 * Groq AI client — no SDK needed, uses standard fetch.
 * Free tier: 30 requests/minute, 14,400 requests/day.
 * Models: llama-3.1-8b-instant (fast), llama-3.3-70b-versatile (smarter)
 *
 * Get a free key at: https://console.groq.com
 * Add to .env: VITE_GROQ_API_KEY=gsk_...
 */

export const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY as string | undefined;
export const GROQ_BASE_URL = "https://api.groq.com/openai/v1";

// Fast model for chat — free, 30 RPM
export const GROQ_CHAT_MODEL = "llama-3.1-8b-instant";

// Smarter model for reflections/analysis — free but lower limits
export const GROQ_SMART_MODEL = "llama-3.3-70b-versatile";

export function isGroqConfigured(): boolean {
  return Boolean(GROQ_API_KEY && GROQ_API_KEY !== "your_groq_key_here");
}

export interface GroqMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

/** Make a single chat completion call to Groq */
export async function groqChat(
  messages: GroqMessage[],
  model = GROQ_CHAT_MODEL,
  maxTokens = 1024,
): Promise<string> {
  if (!GROQ_API_KEY) throw new Error("VITE_GROQ_API_KEY is not set.");

  const res = await fetch(`${GROQ_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens: maxTokens,
      temperature: 0.75,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Groq ${res.status}: ${body}`);
  }

  const data = (await res.json()) as {
    choices: { message: { content: string } }[];
  };
  return data.choices[0]?.message?.content ?? "";
}
