import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { getSupabaseConfig } from '@/lib/supabase/config';

export const PUBLIC_DATA_REVALIDATE_SECONDS = 60;

let publicServerClient: ReturnType<typeof createSupabaseClient> | null = null;

export function createPublicServerClient() {
    if (publicServerClient) {
        return publicServerClient;
    }

    const { url, publishableKey } = getSupabaseConfig();

    publicServerClient = createSupabaseClient(url, publishableKey, {
        auth: {
            autoRefreshToken: false,
            detectSessionInUrl: false,
            persistSession: false,
        },
        global: {
            fetch: (input, init) =>
                fetch(input, {
                    ...init,
                    next: { revalidate: PUBLIC_DATA_REVALIDATE_SECONDS },
                } as RequestInit & { next: { revalidate: number } }),
        },
    });

    return publicServerClient;
}
