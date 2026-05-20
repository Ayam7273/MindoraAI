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

export function friendlyAuthError(err: unknown): string {
  const msg = (err instanceof Error ? err.message : String(err)).toLowerCase();
  if (msg.includes("invalid login credentials") || msg.includes("invalid_credentials"))
    return "Incorrect password. Please try again.";
  if (msg.includes("email not confirmed"))
    return "Please check your email and confirm your account before signing in.";
  if (msg.includes("user already registered") || msg.includes("already been registered"))
    return "An account with this email already exists. Try signing in instead.";
  if (msg.includes("invalid email") || msg.includes("unable to validate email"))
    return "That doesn't look like a valid email address.";
  if (msg.includes("password") && msg.includes("short"))
    return "Your password must be at least 6 characters long.";
  if (msg.includes("user not found") || msg.includes("no user found"))
    return "No account found with that email address.";
  if (msg.includes("network") || msg.includes("fetch") || msg.includes("failed to fetch"))
    return "Can't connect right now. Check your internet connection and try again.";
  if (msg.includes("timeout") || msg.includes("too many requests") || msg.includes("rate limit"))
    return "Too many attempts. Please wait a moment and try again.";
  if (msg.includes("weak password") || msg.includes("password should"))
    return "Please choose a stronger password (mix of letters and numbers).";
  if (msg.includes("email_address_not_authorized"))
    return "This email address is not authorised. Please use a different email.";
  return "Something went wrong. Please try again.";
}
