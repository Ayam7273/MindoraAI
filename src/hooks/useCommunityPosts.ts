import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { CommunityPostRow } from "@/types/database";

export const useCommunityPosts = () =>
  useQuery({
    queryKey: ["community_posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("community_posts")
        .select("*")
        .eq("is_hidden", false)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as CommunityPostRow[];
    },
  });

export const useAddPost = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (
      entry: Omit<CommunityPostRow, "id" | "created_at" | "likes_count" | "comments_count">,
    ) => {
      const { data, error } = await supabase.from("community_posts").insert(entry).select().single();
      if (error) throw error;
      return data as CommunityPostRow;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["community_posts"] }),
  });
};

export const useDeletePost = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: { id: string }) => {
      const { error } = await supabase.from("community_posts").delete().eq("id", vars.id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["community_posts"] }),
  });
};
