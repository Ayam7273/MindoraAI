import { supabase } from "@/lib/supabase";

export async function updateFreudScore(
  userId: string,
  score: number,
  meta?: { label?: string; reason?: string },
) {
  const now = new Date().toISOString();
  const { error: profileErr } = await supabase
    .from("profiles")
    .update({ freud_score: score, updated_at: now })
    .eq("id", userId);
  if (profileErr) throw profileErr;

  const { error: histErr } = await supabase.from("freud_score_history").insert({
    user_id: userId,
    score,
    label: meta?.label ?? null,
    reason: meta?.reason ?? null,
  });
  if (histErr) throw histErr;
}
