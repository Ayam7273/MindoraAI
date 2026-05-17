# Google AI (Gemini) Integration Guide

This guide explains how to integrate Google's Gemini API into the Mindora app to power the AI chatbot, mood suggestions, journal reflections, and other generative features.

---

## 1. Get a Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/).
2. Sign in with your Google account.
3. Click **Get API key** → **Create API key in new project** (or select an existing project).
4. Copy the key — it looks like `AIzaSy...`.

---

## 2. Add the API Key to Your Environment

In your project root, open (or create) `.env`:

```env
VITE_GEMINI_API_KEY=AIzaSy_YOUR_KEY_HERE
```

> **Never commit your `.env` file.** It is already listed in `.gitignore`.

Restart your dev server after adding the key:

```bash
npm run dev
```

---

## 3. Install the Google Generative AI SDK

```bash
npm install @google/generative-ai
```

---

## 4. Wire Up the Client

The stub at `src/lib/gemini.ts` is already in place. Replace its contents with the real client:

```ts
// src/lib/gemini.ts
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
```

---

## 5. Send a Chat Message

Update `src/services/chatbotService.ts` to call Gemini:

```ts
// src/services/chatbotService.ts
import { getModel } from "@/lib/gemini";

export async function sendChatMessage(threadId: string, text: string): Promise<string> {
  const model = getModel();

  const chat = model.startChat({
    history: [],          // Pass previous messages here for multi-turn conversations
    generationConfig: {
      maxOutputTokens: 1024,
      temperature: 0.7,
    },
    systemInstruction: `You are Mindora, a compassionate AI mental wellness companion.
Your role is to listen empathetically, offer evidence-based coping strategies, and gently
encourage users to seek professional help when needed. Never diagnose or prescribe.
Always remind users that you are an AI and not a substitute for professional mental health care.`,
  });

  const result = await chat.sendMessage(text);
  return result.response.text();
}
```

---

## 6. Multi-Turn Conversations

To maintain conversation context, pass the chat history when starting a session:

```ts
import type { Content } from "@google/generative-ai";

export async function sendChatMessageWithHistory(
  history: Content[],
  userText: string
): Promise<string> {
  const model = getModel();
  const chat = model.startChat({ history });
  const result = await chat.sendMessage(userText);
  return result.response.text();
}
```

Map your `ChatMessage[]` from Supabase to the `Content[]` format Gemini expects:

```ts
import type { Content } from "@google/generative-ai";
import type { ChatMessage } from "@/types";

export function toChatHistory(messages: ChatMessage[]): Content[] {
  return messages.map((m) => ({
    role: m.role === "user" ? "user" : "model",
    parts: [{ text: m.text }],
  }));
}
```

---

## 7. Generate Mood AI Suggestions

Use Gemini to produce personalised mood suggestions based on the user's current mood:

```ts
import { getModel } from "@/lib/gemini";
import type { MoodKey } from "@/types";

export async function getMoodSuggestions(mood: MoodKey): Promise<string> {
  const model = getModel();
  const prompt = `The user is currently feeling "${mood}". 
Provide 3 compassionate, evidence-based suggestions to help them improve their emotional wellbeing.
Format each suggestion with a title and two short paragraphs. Be warm and encouraging.`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}
```

---

## 8. Generate Journal AI Reflections

After a user writes a journal entry, generate a reflective response:

```ts
import { getModel } from "@/lib/gemini";

export async function getJournalReflection(journalBody: string): Promise<string> {
  const model = getModel();
  const prompt = `The following is a personal journal entry. 
Provide a brief, empathetic reflection that validates the user's feelings and offers one gentle insight.
Do not give medical advice. Keep it to 3-4 sentences.

Journal entry:
"${journalBody}"`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}
```

---

## 9. Safety & Responsible Use

Gemini has built-in safety filters. You should also add application-level safeguards:

- **Crisis detection**: The app already has `src/lib/crisisDetection.ts`. Wire it to check every user message before sending to the model.
- **Disclaimer**: Always show "Mindora is not a substitute for professional mental health care" in the UI (already in `SideNav`).
- **Rate limiting**: Consider implementing per-user rate limits in Supabase Edge Functions to prevent abuse.
- **No PII in prompts**: Avoid sending identifiable information (full name, email) in prompts. Use anonymised context only.

---

## 10. Supabase Edge Function (Optional — for server-side calls)

To keep your API key off the client, you can call Gemini from a Supabase Edge Function:

```ts
// supabase/functions/chat/index.ts
import { GoogleGenerativeAI } from "npm:@google/generative-ai";

Deno.serve(async (req) => {
  const { message, history } = await req.json();
  const genAI = new GoogleGenerativeAI(Deno.env.get("GEMINI_API_KEY")!);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const chat = model.startChat({ history });
  const result = await chat.sendMessage(message);
  return new Response(JSON.stringify({ reply: result.response.text() }), {
    headers: { "Content-Type": "application/json" },
  });
});
```

Set the secret in Supabase:

```bash
supabase secrets set GEMINI_API_KEY=AIzaSy_YOUR_KEY_HERE
```

Then call it from the app using the Supabase client:

```ts
const { data } = await supabase.functions.invoke("chat", {
  body: { message: userText, history: chatHistory },
});
```

---

## Quick-Reference: Model Names

| Model | Best for |
|-------|----------|
| `gemini-1.5-flash` | Fast, cost-effective — chatbot, suggestions |
| `gemini-1.5-pro` | Longer context, more nuanced — journal reflection |
| `gemini-2.0-flash-exp` | Latest experimental — advanced features |

---

## Troubleshooting

| Error | Fix |
|-------|-----|
| `API_KEY_INVALID` | Check `.env` key and restart the dev server |
| `PERMISSION_DENIED` | Ensure the Gemini API is enabled in Google Cloud Console |
| `SAFETY` block | The model blocked the response — review your prompt for sensitive content |
| `CORS` error | Use a Supabase Edge Function instead of calling Gemini directly from the browser |
