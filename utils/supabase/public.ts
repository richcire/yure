import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Create a client for public data access without any cookie handling
export const createPublicClient = () => {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false, // Don't persist auth state
        autoRefreshToken: false, // Don't refresh tokens
      },
    }
  );
};
