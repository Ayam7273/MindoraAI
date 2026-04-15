import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { AssessmentResponseRow } from "@/types/database";

export const useAssessmentResponses = (userId: string | undefined) =>
  useQuery({
    queryKey: ["assessment_responses", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("assessment_responses")
        .select("*")
        .eq("user_id", userId!)
        .order("completed_at", { ascending: false });
      if (error) throw error;
      return data as AssessmentResponseRow[];
    },
    enabled: Boolean(userId),
  });

export const useSaveAssessmentResponse = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (entry: {
      user_id: string;
      responses: Record<string, unknown>;
      initial_mindora_score?: number | null;
    }) => {
      const { data, error } = await supabase.from("assessment_responses").insert(entry).select().single();
      if (error) throw error;
      return data as AssessmentResponseRow;
    },
    onSuccess: (_, v) => qc.invalidateQueries({ queryKey: ["assessment_responses", v.user_id] }),
  });
};
