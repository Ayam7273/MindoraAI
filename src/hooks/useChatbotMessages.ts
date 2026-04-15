import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { ChatbotMessageRow } from "@/types/database";

export const useChatbotMessages = (conversationId: string | undefined) =>
  useQuery({
    queryKey: ["chatbot_messages", conversationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("chatbot_messages")
        .select("*")
        .eq("conversation_id", conversationId!)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data as ChatbotMessageRow[];
    },
    enabled: Boolean(conversationId),
  });

export const useAddMessage = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (msg: Omit<ChatbotMessageRow, "id" | "created_at">) => {
      const { data, error } = await supabase.from("chatbot_messages").insert(msg).select().single();
      if (error) throw error;
      return data as ChatbotMessageRow;
    },
    onSuccess: (row) => {
      qc.invalidateQueries({ queryKey: ["chatbot_messages", row.conversation_id] });
    },
  });
};
