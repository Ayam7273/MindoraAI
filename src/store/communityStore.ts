import { create } from "zustand";

export interface CommunityNotif {
  id: string;
  type: "like" | "comment";
  postId: string;
  postSnippet: string;
  actorName: string;
  commentPreview?: string;
  createdAt: string; // ISO
  read: boolean;
}

interface CommunityState {
  /** Notifications for the current user's posts */
  notifications: CommunityNotif[];
  /** Posts the current user has liked (post IDs) */
  likedPostIds: Set<string>;
  addNotification: (n: CommunityNotif) => void;
  markAllRead: () => void;
  toggleLike: (postId: string) => void;
  isLiked: (postId: string) => boolean;
  unreadCount: () => number;
}

export const useCommunityStore = create<CommunityState>((set, get) => ({
  notifications: [],
  likedPostIds: new Set(),

  addNotification: (n) =>
    set((s) => ({ notifications: [n, ...s.notifications] })),

  markAllRead: () =>
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, read: true })),
    })),

  toggleLike: (postId) =>
    set((s) => {
      const next = new Set(s.likedPostIds);
      if (next.has(postId)) next.delete(postId);
      else next.add(postId);
      return { likedPostIds: next };
    }),

  isLiked: (postId) => get().likedPostIds.has(postId),

  unreadCount: () => get().notifications.filter((n) => !n.read).length,
}));
