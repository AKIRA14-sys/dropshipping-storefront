import "server-only";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client";

// Public catalog reads only. Customer data stays behind browser sessions and RLS.
export function getSupabaseServerClient() {
  return getSupabaseClient();
}

export { isSupabaseConfigured };
