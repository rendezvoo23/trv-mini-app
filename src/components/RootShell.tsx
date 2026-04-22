'use client';

import { usePathname } from 'next/navigation';
import { BottomNav } from '@/components/BottomNav';
import { QueryProvider } from '@/components/QueryProvider';
import { TelegramProvider } from '@/components/TelegramProvider';

export function RootShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdminRoute = pathname?.startsWith('/admin');

    if (isAdminRoute) {
        return <QueryProvider>{children}</QueryProvider>;
    }

    return (
        <QueryProvider>
            <TelegramProvider>
                <div className="fixed inset-0 z-[-1] bg-gradient-to-b from-[#2855FF]/90 via-white to-white pointer-events-none" />
                <main className="pb-24 min-h-screen relative">{children}</main>
                <BottomNav />
            </TelegramProvider>
        </QueryProvider>
    );
}
