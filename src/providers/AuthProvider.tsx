import { useQueryClient } from "@tanstack/react-query";
import { useEffect, type ReactNode } from "react";
import { getSession, onAuthStateChange } from "@/services/authService";
import { useProfile } from "@/hooks/useProfile";
import { useUiStore } from "@/store/uiStore";

function ProfileHydration({ userId }: { userId: string | undefined }) {
  const { data } = useProfile(userId);
  const setProfile = useUiStore((s) => s.setProfile);

  useEffect(() => {
    if (data) setProfile(data);
  }, [data, setProfile]);

  useEffect(() => {
    if (!userId) setProfile(null);
  }, [userId, setProfile]);

  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const qc = useQueryClient();
  const setSession = useUiStore((s) => s.setSession);
  const setUser = useUiStore((s) => s.setUser);
  const setSessionReady = useUiStore((s) => s.setSessionReady);
  const userId = useUiStore((s) => s.user?.id);

  useEffect(() => {
    let subscription: { unsubscribe: () => void } | undefined;
    void (async () => {
      const { data } = await getSession();
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setSessionReady(true);
      subscription = onAuthStateChange((session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (!session?.user) {
          qc.removeQueries();
          useUiStore.getState().resetEphemeralSession();
        } else {
          qc.invalidateQueries();
        }
      });
    })();
    return () => subscription?.unsubscribe();
  }, [qc, setSession, setSessionReady, setUser]);

  return (
    <>
      <ProfileHydration userId={userId} />
      {children}
    </>
  );
}
