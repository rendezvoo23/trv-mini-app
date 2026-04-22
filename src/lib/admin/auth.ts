import { redirect } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient as createServerSupabaseClient } from '@/lib/supabase/server';

export interface AdminActionState {
    success: boolean;
    message?: string;
    fieldErrors?: Record<string, string>;
}

export function createEmptyAdminActionState(): AdminActionState {
    return { success: false };
}

export async function getAdminUser() {
    const supabase = await createServerSupabaseClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    return user;
}

export async function requireAdminUser() {
    const user = await getAdminUser();

    if (!user) {
        redirect('/admin/login');
    }

    return user;
}

export async function getAdminDbClient() {
    await requireAdminUser();

    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
        return createAdminClient();
    }

    return createServerSupabaseClient();
}
