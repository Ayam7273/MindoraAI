import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { SleepEntryRow } from "@/types/database";

export const useSleepEntries = (userId: string | undefined) =>
  useQuery({
    queryKey: ["sleep_entries", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sleep_entries")
        .select("*")
        .eq("user_id", userId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as SleepEntryRow[];
    },
    enabled: Boolean(userId),
  });

export const useAddSleepEntry = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (entry: Omit<SleepEntryRow, "id" | "created_at">) => {
      const { data, error } = await supabase.from("sleep_entries").insert(entry).select().single();
      if (error) throw error;
      return data as SleepEntryRow;
    },
    onSuccess: (_, v) => qc.invalidateQueries({ queryKey: ["sleep_entries", v.user_id] }),
  });
};
