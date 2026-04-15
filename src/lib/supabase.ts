import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

function assertValidSupabaseEnv(u: string | undefined, key: string | undefined) {
  if (!u || !key) {
    throw new Error(
      "Supabase env missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env and restart dev server.",
    );
  }
  const trimmed = u.trim();
  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    throw new Error(`Invalid VITE_SUPABASE_URL: ${JSON.stringify(u)}`);
  }
  if (!/\.supabase\.co$/i.test(parsed.hostname)) {
    throw new Error(`VITE_SUPABASE_URL must end with .supabase.co (got ${parsed.hostname})`);
  }
}

assertValidSupabaseEnv(url, anon);

export const supabase = createClient(url!.trim(), anon!.trim());
