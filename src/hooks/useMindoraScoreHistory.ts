import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { updateMindoraScore } from "@/services/mindoraScoreService";
import type { MindoraScoreHistoryRow } from "@/types/database";

export const useMindoraScoreHistory = (userId: string | undefined) =>
  useQuery({
    queryKey: ["mindora_score_history", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("mindora_score_history")
        .select("*")
        .eq("user_id", userId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as MindoraScoreHistoryRow[];
    },
    enabled: Boolean(userId),
  });

export const useUpdateMindoraScore = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: {
      userId: string;
      score: number;
      label?: string;
      reason?: string;
    }) => {
      await updateMindoraScore(vars.userId, vars.score, { label: vars.label, reason: vars.reason });
    },
    onSuccess: (_, v) => {
      qc.invalidateQueries({ queryKey: ["mindora_score_history", v.userId] });
      qc.invalidateQueries({ queryKey: ["profile", v.userId] });
    },
  });
};

