import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { getSupabaseConfig } from '@/lib/supabase/config';

export async function createClient() {
    const cookieStore = cookies();
    const { url, publishableKey } = getSupabaseConfig();

    return createServerClient(url, publishableKey, {
        cookies: {
            get(name: string) {
                return cookieStore.get(name)?.value;
            },
            set(name: string, value: string, options: Record<string, unknown>) {
                try {
                    cookieStore.set({ name, value, ...(options as object) });
                } catch {
                    // Server Components cannot always write cookies.
                }
            },
            remove(name: string, options: Record<string, unknown>) {
                try {
                    cookieStore.set({ name, value: '', ...(options as object) });
                } catch {
                    // Server Components cannot always write cookies.
                }
            },
        },
    });
}
