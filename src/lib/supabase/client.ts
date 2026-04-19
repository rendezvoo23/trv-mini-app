'use client';

import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { getSupabaseConfig } from '@/lib/supabase/config';

let browserClient: ReturnType<typeof createSupabaseClient> | null = null;

export function createClient() {
    if (browserClient) {
        return browserClient;
    }

    const { url, publishableKey } = getSupabaseConfig();

    browserClient = createSupabaseClient(url, publishableKey, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
        },
    });

    return browserClient;
}
