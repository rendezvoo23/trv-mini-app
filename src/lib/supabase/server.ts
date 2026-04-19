import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { getSupabaseConfig } from '@/lib/supabase/config';

export function createClient() {
    const { url, publishableKey } = getSupabaseConfig();

    return createSupabaseClient(url, publishableKey, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
        },
    });
}
