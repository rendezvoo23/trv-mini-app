import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { getSupabaseConfig } from '@/lib/supabase/config';

export async function updateSession(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    const { url, publishableKey } = getSupabaseConfig();

    const supabase = createServerClient(url, publishableKey, {
        cookies: {
            get(name: string) {
                return request.cookies.get(name)?.value;
            },
            set(name: string, value: string, options: Record<string, unknown>) {
                request.cookies.set({
                    name,
                    value,
                    ...(options as object),
                });

                response = NextResponse.next({
                    request: {
                        headers: request.headers,
                    },
                });

                response.cookies.set({
                    name,
                    value,
                    ...(options as object),
                });
            },
            remove(name: string, options: Record<string, unknown>) {
                request.cookies.set({
                    name,
                    value: '',
                    ...(options as object),
                });

                response = NextResponse.next({
                    request: {
                        headers: request.headers,
                    },
                });

                response.cookies.set({
                    name,
                    value: '',
                    ...(options as object),
                });
            },
        },
    });

    await supabase.auth.getUser();

    return response;
}
