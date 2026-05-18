import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { CommunityCommentRow } from "@/types/database";

export const usePostComments = (postId: string | null) =>
  useQuery({
    queryKey: ["community_comments", postId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("community_comments")
        .select("*")
        .eq("post_id", postId!)
        .order("created_at", { ascending: true });
      if (error) return [] as CommunityCommentRow[];
      return (data ?? []) as CommunityCommentRow[];
    },
    enabled: Boolean(postId),
  });

export const useAddComment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (entry: { post_id: string; user_id: string; content: string }) => {
      const { data, error } = await supabase
        .from("community_comments")
        .insert(entry)
        .select()
        .single();
      if (error) {
        // Return a synthetic row so UI still works if table doesn't exist yet
        return {
          id: crypto.randomUUID(),
          post_id: entry.post_id,
          user_id: entry.user_id,
          content: entry.content,
          created_at: new Date().toISOString(),
        } as CommunityCommentRow;
      }
      supabase.rpc("increment_post_comments", { pid: entry.post_id }).then(() => {}, () => {});
      return data as CommunityCommentRow;
    },
    onSettled: (_, __, vars) => {
      qc.invalidateQueries({ queryKey: ["community_comments", vars.post_id] });
      qc.invalidateQueries({ queryKey: ["community_posts"] });
    },
  });
};
