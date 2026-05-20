import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { CommunityNotificationRow } from "@/types/database";

/** Fetch notifications where I am the recipient */
export const useCommunityNotifications = (userId: string | undefined) =>
  useQuery({
    queryKey: ["community_notifications", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("community_notifications")
        .select("*")
        .eq("recipient_user_id", userId!)
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) return [] as CommunityNotificationRow[];
      return (data ?? []) as CommunityNotificationRow[];
    },
    enabled: Boolean(userId),
    refetchOnWindowFocus: true,
    staleTime: 30_000,
  });

/** Count unread notifications for the current user */
export const useUnreadNotificationCount = (userId: string | undefined) => {
  const { data = [] } = useCommunityNotifications(userId);
  return data.filter((n) => !n.read).length;
};

/** Insert a notification for another user (the post owner) */
export const useInsertNotification = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (row: {
      recipient_user_id: string;
      actor_user_id: string;
      actor_name: string;       // display name of the actor at time of action
      post_id: string;
      type: "like" | "comment";
      comment_preview?: string | null;
    }) => {
      // Don't notify yourself
      if (row.recipient_user_id === row.actor_user_id) return;
      const { error } = await supabase
        .from("community_notifications")
        .insert({
          recipient_user_id: row.recipient_user_id,
          actor_user_id: row.actor_user_id,
          actor_name: row.actor_name,
          post_id: row.post_id,
          type: row.type,
          comment_preview: row.comment_preview ?? null,
          read: false,
        });
      if (error) console.warn("Notification insert failed:", error.message);
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["community_notifications", vars.recipient_user_id] });
    },
  });
};

/** Mark all notifications read for the current user */
export const useMarkAllNotificationsRead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (userId: string) => {
      await supabase
        .from("community_notifications")
        .update({ read: true })
        .eq("recipient_user_id", userId)
        .eq("read", false);
    },
    onSuccess: (_, userId) => {
      qc.invalidateQueries({ queryKey: ["community_notifications", userId] });
    },
  });
};
