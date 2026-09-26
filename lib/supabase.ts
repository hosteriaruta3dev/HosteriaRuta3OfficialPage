import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const STORAGE_BUCKET = "hosteria";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const SECRET_KEY = process.env.SUPABASE_SECRET_KEY;

let publicClient: SupabaseClient | null = null;
let adminClient: SupabaseClient | null = null;

export function getSupabasePublic(): SupabaseClient {
  if (!SUPABASE_URL || !PUBLISHABLE_KEY) {
    throw new Error(
      "Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
    );
  }
  if (!publicClient) {
    publicClient = createClient(SUPABASE_URL, PUBLISHABLE_KEY, {
      auth: { persistSession: false },
    });
  }
  return publicClient;
}

export function getSupabaseAdmin(): SupabaseClient {
  if (!SUPABASE_URL || !SECRET_KEY) {
    throw new Error("Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SECRET_KEY.");
  }
  if (!adminClient) {
    adminClient = createClient(SUPABASE_URL, SECRET_KEY, {
      auth: { persistSession: false },
    });
  }
  return adminClient;
}
