import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { MindfulSessionRow } from "@/types/database";

export const useMindfulSessions = (userId: string | undefined) =>
  useQuery({
    queryKey: ["mindful_sessions", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("mindful_sessions")
        .select("*")
        .eq("user_id", userId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as MindfulSessionRow[];
    },
    enabled: Boolean(userId),
  });

export const useAddMindfulSession = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (entry: Omit<MindfulSessionRow, "id" | "created_at">) => {
      const { data, error } = await supabase.from("mindful_sessions").insert(entry).select().single();
      if (error) throw error;
      return data as MindfulSessionRow;
    },
    onSuccess: (_, v) => qc.invalidateQueries({ queryKey: ["mindful_sessions", v.user_id] }),
  });
};
