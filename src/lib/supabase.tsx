import { createClient, SupabaseClient } from "@supabase/supabase-js";

let supabaseClient: SupabaseClient | null = null;

export const useSupabase = () => {
  if (!supabaseClient) {
    supabaseClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_KEY as string,
      {
        auth: {
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
        realtime: {
          heartbeatIntervalMs: 5000,
        },
      }
    );
  }
  return supabaseClient;
};
