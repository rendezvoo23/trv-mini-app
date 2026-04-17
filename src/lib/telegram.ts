'use client';

/**
 * Telegram WebApp SDK initialization helper.
 * Uses the script-based Telegram WebApp API.
 */

export interface TelegramInitDataUser {
    id: string;
    username?: string;
    first_name?: string;
    last_name?: string;
    language_code?: string;
    is_premium?: boolean;
}

export interface TelegramLaunchContext {
    user: TelegramInitDataUser | null;
    start_param: string | null;
    auth_date: number | null;
    hash: string | null;
    raw_init_data: string | null;
}

declare global {
    interface Window {
        Telegram?: {
            WebApp: {
                ready: () => void;
                expand: () => void;
                close: () => void;
                MainButton: {
                    text: string;
                    show: () => void;
                    hide: () => void;
                    onClick: (cb: () => void) => void;
                };
                BackButton: {
                    show: () => void;
                    hide: () => void;
                    onClick: (cb: () => void) => void;
                    offClick: (cb: () => void) => void;
                };
                themeParams: {
                    bg_color?: string;
                    text_color?: string;
                    hint_color?: string;
                    link_color?: string;
                    button_color?: string;
                    button_text_color?: string;
                };
                viewportHeight: number;
                viewportStableHeight: number;
                isExpanded: boolean;
                colorScheme: 'light' | 'dark';
                initData: string;
                initDataUnsafe: {
                    user?: TelegramInitDataUser;
                    start_param?: string;
                    auth_date?: number;
                    hash?: string;
                    [key: string]: unknown;
                };
                openLink: (url: string) => void;
            };
        };
    }
}

export function initTelegram() {
    if (typeof window === 'undefined') return null;

    const tg = window.Telegram?.WebApp;
    if (!tg) {
        console.warn('Telegram WebApp SDK not available — running outside Telegram');
        return null;
    }

    tg.ready();
    tg.expand();

    return tg;
}

export function getTelegram() {
    if (typeof window === 'undefined') return null;
    return window.Telegram?.WebApp || null;
}

export function getTelegramLaunchContext(): TelegramLaunchContext | null {
    const tg = getTelegram();
    if (!tg) {
        return null;
    }

    const initDataUnsafe = tg.initDataUnsafe ?? {};

    return {
        user: initDataUnsafe.user ?? null,
        start_param:
            typeof initDataUnsafe.start_param === 'string'
                ? initDataUnsafe.start_param
                : null,
        auth_date:
            typeof initDataUnsafe.auth_date === 'number'
                ? initDataUnsafe.auth_date
                : null,
        hash:
            typeof initDataUnsafe.hash === 'string' ? initDataUnsafe.hash : null,
        raw_init_data: tg.initData || null,
    };
}

export function getTelegramIdentityPreview() {
    const launchContext = getTelegramLaunchContext();
    if (!launchContext?.user) {
        return null;
    }

    return {
        telegram_user_id: launchContext.user.id,
        telegram_username: launchContext.user.username ?? null,
        first_name: launchContext.user.first_name ?? null,
        last_name: launchContext.user.last_name ?? null,
        language_code: launchContext.user.language_code ?? null,
        raw_init_data: launchContext.raw_init_data,
    };
}

export function openExternalLink(url: string) {
    const tg = getTelegram();
    if (tg) {
        tg.openLink(url);
    } else {
        window.open(url, '_blank', 'noopener,noreferrer');
    }
}
