import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { CommunityLikeRow } from "@/types/database";

/** Fetch all likes by the current user so we know which posts they've liked */
export const useMyLikes = (userId: string | undefined) =>
  useQuery({
    queryKey: ["community_likes", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("community_likes")
        .select("post_id")
        .eq("user_id", userId!);
      if (error) return [] as { post_id: string }[];
      return (data ?? []) as { post_id: string }[];
    },
    enabled: Boolean(userId),
  });

export const useToggleLike = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      postId,
      userId,
      liked,
    }: {
      postId: string;
      userId: string;
      liked: boolean;
    }) => {
      if (liked) {
        await supabase
          .from("community_likes")
          .delete()
          .eq("post_id", postId)
          .eq("user_id", userId);
        supabase.rpc("decrement_post_likes", { pid: postId }).then(() => {}, () => {});
      } else {
        await supabase
          .from("community_likes")
          .insert({ post_id: postId, user_id: userId } satisfies Partial<CommunityLikeRow>);
        supabase.rpc("increment_post_likes", { pid: postId }).then(() => {}, () => {});
      }
    },
    onSettled: (_, __, { userId }) => {
      qc.invalidateQueries({ queryKey: ["community_posts"] });
      qc.invalidateQueries({ queryKey: ["community_likes", userId] });
    },
  });
};
