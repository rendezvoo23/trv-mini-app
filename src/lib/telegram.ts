'use client';

/**
 * Telegram WebApp SDK initialization helper.
 * Uses the script-based Telegram WebApp API.
 */

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
                initDataUnsafe: Record<string, unknown>;
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

export function openExternalLink(url: string) {
    const tg = getTelegram();
    if (tg) {
        tg.openLink(url);
    } else {
        window.open(url, '_blank', 'noopener,noreferrer');
    }
}
