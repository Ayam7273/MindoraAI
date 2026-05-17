import type { Session, User } from "@supabase/supabase-js";
import { create } from "zustand";
import type { Profile } from "@/types/database";
import type { MoodKey } from "@/types";

interface UiState {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  sessionReady: boolean;

  setSession: (session: Session | null) => void;
  setUser: (user: User | null) => void;
  setProfile: (profile: Profile | null) => void;
  setSessionReady: (value: boolean) => void;

  activeMood: MoodKey | null;
  setActiveMood: (mood: MoodKey | null) => void;

  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;

  crisisMode: boolean;
  setCrisisMode: (value: boolean) => void;

  isOnboarding: boolean;
  setIsOnboarding: (value: boolean) => void;

  resetEphemeralSession: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  session: null,
  user: null,
  profile: null,
  sessionReady: false,

  setSession: (session) => set({ session }),
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setSessionReady: (sessionReady) => set({ sessionReady }),

  activeMood: null,
  setActiveMood: (mood) => set({ activeMood: mood }),

  activeConversationId: null,
  setActiveConversationId: (id) => set({ activeConversationId: id }),

  crisisMode: false,
  setCrisisMode: (value) => set({ crisisMode: value }),

  isOnboarding: false,
  setIsOnboarding: (value) => set({ isOnboarding: value }),

  resetEphemeralSession: () =>
    set({
      session: null,
      user: null,
      profile: null,
      crisisMode: false,
      activeConversationId: null,
    }),
}));
