import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { CommunityPostRow } from "@/types/database";

export const useCommunityPosts = () =>
  useQuery({
    queryKey: ["community_posts"],
    queryFn: async () => {
      // Fetch posts
      const { data: posts, error } = await supabase
        .from("community_posts")
        .select("*")
        .eq("is_hidden", false)
        .order("created_at", { ascending: false });
      if (error) throw error;
      if (!posts?.length) return [] as CommunityPostRow[];

      // Fetch profiles for all unique authors in one query
      const userIds = [...new Set(posts.map((p) => p.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url")
        .in("id", userIds);

      // Merge profile data onto each post
      const profileMap = Object.fromEntries((profiles ?? []).map((p) => [p.id, p]));
      return posts.map((post) => ({
        ...post,
        profiles: profileMap[post.user_id] ?? null,
      })) as CommunityPostRow[];
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
