import "server-only";
import { getSupabaseClient } from "@/lib/supabase/client";
export { isSupabaseConfigured } from "@/lib/supabase/client";

// This intentionally uses only the public anon key. RLS/RPCs protect every server operation.
export function getSupabaseServerClient() {
  return getSupabaseClient();
}
