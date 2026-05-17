import { useState, useCallback } from "react";

export interface ChatMessage {
  id: string;
  role: "user" | "ai";
  text: string;
  timestamp: string;
}

export interface ChatConversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

/** Deprecated local storage helpers — data now lives in Supabase via useChatbotConversations hook. */
export function getConversation(_id: string): ChatConversation | undefined {
  return undefined;
}

export function createConversation(title: string): ChatConversation {
  const now = new Date().toISOString();
  return { id: crypto.randomUUID(), title, messages: [], createdAt: now, updatedAt: now };
}

export function updateConversation(_id: string, _messages: ChatMessage[]): void {}

export function deleteConversation(_id: string): void {}

export function useChatStorage() {
  const [conversations] = useState<ChatConversation[]>([]);

  const refresh = useCallback(() => {}, []);
  const addConversation = useCallback((title: string) => createConversation(title), []);
  const removeConversation = useCallback((_id: string) => {}, []);
  const syncConversation = useCallback((_id: string, _messages: ChatMessage[]) => {}, []);

  return { conversations, refresh, addConversation, removeConversation, syncConversation };
}
