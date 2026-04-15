import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Profile } from "@/types/database";

export const useProfile = (userId: string | undefined) =>
  useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", userId!).single();
      if (error) throw error;
      return data as Profile;
    },
    enabled: Boolean(userId),
  });

export const useUpdateProfile = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: { id: string; patch: Partial<Profile> }) => {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from("profiles")
        .update({ ...vars.patch, updated_at: now })
        .eq("id", vars.id)
        .select()
        .single();
      if (error) throw error;
      return data as Profile;
    },
    onSuccess: (_, v) => {
      qc.invalidateQueries({ queryKey: ["profile", v.id] });
    },
  });
};
