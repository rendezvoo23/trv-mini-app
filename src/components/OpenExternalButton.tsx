'use client';

import { openExternalLink } from '@/lib/telegram';

interface OpenExternalButtonProps {
    url: string | null;
    label: string;
    ariaLabel?: string;
    className?: string;
}

export function OpenExternalButton({
    url,
    label,
    ariaLabel,
    className,
}: OpenExternalButtonProps) {
    return (
        <button
            type="button"
            onClick={() => {
                if (url) {
                    openExternalLink(url);
                }
            }}
            disabled={!url}
            className={className}
            aria-label={ariaLabel ?? label}
        >
            <span>{label}</span>
        </button>
    );
}
