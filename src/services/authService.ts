import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export const signUp = async (email: string, password: string) => {
  return supabase.auth.signUp({ email, password });
};

export const signIn = async (email: string, password: string) => {
  return supabase.auth.signInWithPassword({ email, password });
};

export const signInWithGoogle = async () => {
  return supabase.auth.signInWithOAuth({ provider: "google" });
};

export const signOut = async () => {
  return supabase.auth.signOut();
};

export const resetPassword = async (email: string) => {
  return supabase.auth.resetPasswordForEmail(email);
};

export const getSession = async () => {
  return supabase.auth.getSession();
};

export const onAuthStateChange = (callback: (session: Session | null) => void) => {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });
  return data.subscription;
};
