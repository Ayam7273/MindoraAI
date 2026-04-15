import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { updateFreudScore } from "@/services/freudScoreService";
import type { FreudScoreHistoryRow } from "@/types/database";

export const useFreudScoreHistory = (userId: string | undefined) =>
  useQuery({
    queryKey: ["freud_score_history", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("freud_score_history")
        .select("*")
        .eq("user_id", userId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as FreudScoreHistoryRow[];
    },
    enabled: Boolean(userId),
  });

export const useUpdateFreudScore = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: {
      userId: string;
      score: number;
      label?: string;
      reason?: string;
    }) => {
      await updateFreudScore(vars.userId, vars.score, { label: vars.label, reason: vars.reason });
    },
    onSuccess: (_, v) => {
      qc.invalidateQueries({ queryKey: ["freud_score_history", v.userId] });
      qc.invalidateQueries({ queryKey: ["profile", v.userId] });
    },
  });
};
