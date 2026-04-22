import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { getSupabaseConfig } from '@/lib/supabase/config';

export function createAdminClient() {
    const { url } = getSupabaseConfig();
    const key =
        process.env.SUPABASE_SERVICE_ROLE_KEY ??
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    if (!key) {
        throw new Error(
            'Supabase admin key is missing. Set SUPABASE_SERVICE_ROLE_KEY for admin writes.'
        );
    }

    return createSupabaseClient(url, key, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
        },
    });
}
