'use client';

import { useState } from 'react';
import { appendPromoCodeToUrl } from '@/domain/external-links';
import { ExternalLinkViewModel } from '@/domain/view-models';
import { openExternalLink } from '@/lib/telegram';

interface EventPrimaryActionProps {
    primaryLink: ExternalLinkViewModel;
}

export function EventPrimaryAction({ primaryLink }: EventPrimaryActionProps) {
    const [promoCode, setPromoCode] = useState('');
    const primaryLinkUrl =
        primaryLink.kind === 'tickets'
            ? appendPromoCodeToUrl(primaryLink.url, promoCode)
            : primaryLink.url;

    return (
        <div className="space-y-3">
            {primaryLink.kind === 'tickets' && (
                <div className="space-y-1.5">
                    <label className="text-[13px] uppercase tracking-[0.12em] text-[#707070]">
                        Promo Code
                    </label>
                    <input
                        placeholder="Enter promo code"
                        value={promoCode}
                        onChange={(event) => setPromoCode(event.target.value)}
                        className="h-[44px] w-full border border-black bg-white px-3 text-[16px] text-black outline-none placeholder:text-[#9d9d9d]"
                    />
                </div>
            )}
            <button
                type="button"
                className="flex h-[44px] w-full items-center justify-center border border-black bg-white text-[16px] text-black active:bg-[#ececec]"
                onClick={() => openExternalLink(primaryLinkUrl)}
            >
                {primaryLink.label}
            </button>
        </div>
    );
}
