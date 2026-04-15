import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { MoodEntryRow, MoodValue } from "@/types/database";

export const useMoodEntries = (userId: string | undefined) =>
  useQuery({
    queryKey: ["mood_entries", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("mood_entries")
        .select("*")
        .eq("user_id", userId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as MoodEntryRow[];
    },
    enabled: Boolean(userId),
  });

export const useAddMoodEntry = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (entry: { user_id: string; mood: MoodValue; note?: string | null }) => {
      const { data, error } = await supabase.from("mood_entries").insert(entry).select().single();
      if (error) throw error;
      return data as MoodEntryRow;
    },
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: ["mood_entries", vars.user_id] }),
  });
};
