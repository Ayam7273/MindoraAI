import type { ChatMessage } from "./chatStorage";

const SYSTEM_PROMPT = `You are Mindora, a compassionate AI companion supporting users with anxiety, stress, and emotional well-being while they await professional clinical care. Be warm, empathetic, non-judgmental, and evidence-informed in your responses.

Guidelines:
- Listen actively and reflect feelings before offering advice
- Use evidence-based techniques (CBT, mindfulness, grounding) when appropriate
- Keep responses concise and human — avoid clinical jargon
- Never diagnose, prescribe, or replace professional mental health care
- If someone expresses thoughts of self-harm or crisis, gently direct them to professional help and crisis resources (988 in the US)
- Celebrate small wins and progress
- Ask follow-up questions to better understand the user's situation`;

export async function* streamAIResponse(
  messages: ChatMessage[],
  signal?: AbortSignal,
): AsyncGenerator<string> {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY as string | undefined;

  if (!apiKey) {
    yield* fallbackResponse(messages);
    return;
  }

  const anthropicMessages = messages.map((m) => ({
    role: m.role === "user" ? "user" : "assistant",
    content: m.text,
  }));

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-beta": "messages-2023-12-15",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: anthropicMessages,
      stream: true,
    }),
    signal,
  });

  if (!response.ok || !response.body) {
    yield* fallbackResponse(messages);
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      const data = line.slice(6).trim();
      if (data === "[DONE]") return;
      try {
        const parsed = JSON.parse(data) as {
          type: string;
          delta?: { type: string; text: string };
        };
        if (parsed.type === "content_block_delta" && parsed.delta?.type === "text_delta") {
          yield parsed.delta.text;
        }
      } catch {
        // skip malformed SSE
      }
    }
  }
}

async function* fallbackResponse(messages: ChatMessage[]): AsyncGenerator<string> {
  const last = messages[messages.length - 1];
  const text = last?.text?.toLowerCase() ?? "";

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
      "Anxiety can feel overwhelming. Let's try a quick grounding exercise: name 5 things you can see around you right now. This helps bring your nervous system back to the present moment. 💙";
  } else if (text.includes("stress") || text.includes("overwhelm")) {
    reply =
      "It sounds like you're carrying a lot right now. Take a slow, deep breath with me — inhale for 4 counts, hold for 4, exhale for 6. Sometimes just acknowledging the stress is the first step. What's weighing on you most today?";
  } else if (text.includes("sad") || text.includes("depress") || text.includes("hopeless")) {
    reply =
      "I'm sorry you're feeling this way. Those feelings are valid, and you don't have to face them alone. Can you tell me a little more about what's been going on?";
  } else if (text.includes("sleep") || text.includes("insomnia") || text.includes("tired")) {
    reply =
      "Sleep struggles can really affect everything else. A simple tip: try keeping a consistent sleep time, and avoid screens 30 minutes before bed. Is there something on your mind keeping you awake?";
  } else {
    reply =
      "Thank you for sharing that with me. I'm here to listen and support you. What's been on your mind lately?";
  }

  // Simulate streaming by yielding word by word
  const words = reply.split(" ");
  for (const word of words) {
    yield word + " ";
    await new Promise((r) => setTimeout(r, 30));
  }
}
