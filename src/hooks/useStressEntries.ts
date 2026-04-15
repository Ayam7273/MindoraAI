import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { StressEntryRow } from "@/types/database";

export const useStressEntries = (userId: string | undefined) =>
  useQuery({
    queryKey: ["stress_entries", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stress_entries")
        .select("*")
        .eq("user_id", userId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as StressEntryRow[];
    },
    enabled: Boolean(userId),
  });

export const useAddStressEntry = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (entry: {
      user_id: string;
      stress_level: number;
      stressors?: string[] | null;
      life_impact?: string | null;
    }) => {
      const { data, error } = await supabase.from("stress_entries").insert(entry).select().single();
      if (error) throw error;
      return data as StressEntryRow;
    },
    onSuccess: (_, v) => qc.invalidateQueries({ queryKey: ["stress_entries", v.user_id] }),
  });
};
