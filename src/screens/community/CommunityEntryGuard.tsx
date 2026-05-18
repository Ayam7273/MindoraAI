import { Navigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { useUiStore } from "@/store/uiStore";

type Status = "loading" | "has-posts" | "no-posts";

export function CommunityEntryGuard() {
  const userId = useUiStore((s) => s.user?.id);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    if (!userId) {
      setStatus("no-posts");
      return;
    }
    supabase
      .from("community_posts")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .then(({ count }) => {
        setStatus((count ?? 0) > 0 ? "has-posts" : "no-posts");
      });
  }, [userId]);

  if (status === "loading") {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#FAF8F4]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-accent-green)]" />
      </div>
    );
  }

  return <Navigate to={status === "has-posts" ? "/community/feed" : "/community/welcome"} replace />;
}
