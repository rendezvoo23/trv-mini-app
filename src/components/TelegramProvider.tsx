'use client';

import { useEffect } from 'react';
import { initTelegram } from '@/lib/telegram';

const AUTH_SYNC_STORAGE_KEY = 'trv:telegram-auth-synced';

export function TelegramProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        const telegram = initTelegram();
        const initData = telegram?.initData;

        if (!initData) {
            return;
        }

        const syncKey = `${AUTH_SYNC_STORAGE_KEY}:${initData}`;
        if (sessionStorage.getItem(syncKey)) {
            return;
        }

        fetch('/api/auth/telegram-miniapp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ initData }),
            keepalive: true,
        }).then((response) => {
            if (response.ok) {
                sessionStorage.setItem(syncKey, '1');
            }
        }).catch(() => {
            // Auth sync is best-effort; storefront browsing should keep working.
        });
    }, []);

    return <>{children}</>;
}
