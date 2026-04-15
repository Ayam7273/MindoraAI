import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { JournalEntryRow, MoodValue } from "@/types/database";

export const useJournalEntries = (userId: string | undefined) =>
  useQuery({
    queryKey: ["journal_entries", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("journal_entries")
        .select("*")
        .eq("user_id", userId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as JournalEntryRow[];
    },
    enabled: Boolean(userId),
  });

export type JournalInsert = {
  user_id: string;
  title: string;
  content: string;
  type?: "text" | "voice";
  emotion?: MoodValue | null;
  stress_level?: number | null;
  stressors?: string[] | null;
  sentiment?: "positive" | "negative" | "neutral" | null;
  has_crisis_language?: boolean;
  ai_suggestions?: unknown;
};

export const useAddJournal = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (entry: JournalInsert) => {
      const { data, error } = await supabase.from("journal_entries").insert(entry).select().single();
      if (error) throw error;
      return data as JournalEntryRow;
    },
    onSuccess: (_, v) => qc.invalidateQueries({ queryKey: ["journal_entries", v.user_id] }),
  });
};

export const useUpdateJournal = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: { id: string; user_id: string; patch: Partial<JournalEntryRow> }) => {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from("journal_entries")
        .update({ ...vars.patch, updated_at: now })
        .eq("id", vars.id)
        .select()
        .single();
      if (error) throw error;
      return data as JournalEntryRow;
    },
    onSuccess: (_, v) => qc.invalidateQueries({ queryKey: ["journal_entries", v.user_id] }),
  });
};

export const useDeleteJournal = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: { id: string; user_id: string }) => {
      const { error } = await supabase.from("journal_entries").delete().eq("id", vars.id);
      if (error) throw error;
    },
    onSuccess: (_, v) => qc.invalidateQueries({ queryKey: ["journal_entries", v.user_id] }),
  });
};
