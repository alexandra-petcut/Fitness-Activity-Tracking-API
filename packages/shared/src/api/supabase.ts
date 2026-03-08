import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (client) return client;

  const url =
    typeof process !== "undefined"
      ? process.env.NEXT_PUBLIC_SUPABASE_URL ??
        process.env.EXPO_PUBLIC_SUPABASE_URL
      : undefined;

  const anonKey =
    typeof process !== "undefined"
      ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
        process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
      : undefined;

  if (!url || !anonKey) {
    throw new Error(
      "Missing Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY)"
    );
  }

  client = createClient(url, anonKey);
  return client;
}

export function createSupabaseClient(
  url: string,
  anonKey: string,
  options?: { auth?: { storage?: unknown; autoRefreshToken?: boolean } }
): SupabaseClient {
  return createClient(url, anonKey, options);
}
