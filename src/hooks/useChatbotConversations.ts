import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { ChatbotConversationRow } from "@/types/database";

export const useChatbotConversations = (userId: string | undefined) =>
  useQuery({
    queryKey: ["chatbot_conversations", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("chatbot_conversations")
        .select("*")
        .eq("user_id", userId!)
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data as ChatbotConversationRow[];
    },
    enabled: Boolean(userId),
  });

export const useDeleteConversation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, userId }: { id: string; userId: string }) => {
      const { error } = await supabase.from("chatbot_conversations").delete().eq("id", id);
      if (error) throw error;
      return { id, userId };
    },
    onSuccess: ({ userId }) =>
      qc.invalidateQueries({ queryKey: ["chatbot_conversations", userId] }),
  });
};

export const useUpsertConversation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (row: Partial<ChatbotConversationRow> & { user_id: string; name: string }) => {
      if (row.id) {
        const { id, ...patch } = row;
        const { data, error } = await supabase
          .from("chatbot_conversations")
          .update({ ...patch, updated_at: new Date().toISOString() })
          .eq("id", id)
          .select()
          .single();
        if (error) throw error;
        return data as ChatbotConversationRow;
      }
      const { data, error } = await supabase.from("chatbot_conversations").insert(row).select().single();
      if (error) throw error;
      return data as ChatbotConversationRow;
    },
    onSuccess: (row) => qc.invalidateQueries({ queryKey: ["chatbot_conversations", row.user_id] }),
  });
};
