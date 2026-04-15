import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { SleepScheduleRow } from "@/types/database";

export const useSleepSchedule = (userId: string | undefined) =>
  useQuery({
    queryKey: ["sleep_schedules", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sleep_schedules")
        .select("*")
        .eq("user_id", userId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as SleepScheduleRow[];
    },
    enabled: Boolean(userId),
  });

export const useSetSleepSchedule = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (row: Omit<SleepScheduleRow, "id" | "created_at"> & { id?: string }) => {
      if (row.id) {
        const { id, ...rest } = row;
        const { data, error } = await supabase
          .from("sleep_schedules")
          .update(rest)
          .eq("id", id)
          .select()
          .single();
        if (error) throw error;
        return data as SleepScheduleRow;
      }
      const { data, error } = await supabase.from("sleep_schedules").insert(row).select().single();
      if (error) throw error;
      return data as SleepScheduleRow;
    },
    onSuccess: (row) => qc.invalidateQueries({ queryKey: ["sleep_schedules", row.user_id] }),
  });
};
