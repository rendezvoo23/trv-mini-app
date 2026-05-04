'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { appendPromoCodeToUrl } from '@/domain/external-links';
import { openExternalLink } from '@/lib/telegram';
import { useEvent } from '@/lib/hooks/useEvents';
import { getPreferredEventLink } from '@/lib/services/viewModelMappers';

export default function EventDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { data: event, isLoading, isError } = useEvent(params.id as string);
    const [promoCode, setPromoCode] = useState('');

    if (isLoading) {
        return (
            <div
                className="min-h-screen bg-[#f4f4f1] px-6 pb-24 pt-6 text-black"
                style={{ fontFamily: 'Arial, sans-serif' }}
            >
                <div className="mb-8 flex items-center justify-between">
                    <Skeleton className="h-6 w-6 rounded-none bg-[#dddddd]" />
                    <Skeleton className="h-8 w-32 rounded-none bg-[#dddddd]" />
                    <div className="w-6" />
                </div>
                <Skeleton className="aspect-[3/4] w-full rounded-none bg-[#dddddd]" />
                <div className="mt-6 space-y-2">
                    <Skeleton className="h-4 w-16 rounded-none bg-[#dddddd]" />
                    <Skeleton className="h-8 w-40 rounded-none bg-[#dddddd]" />
                    <Skeleton className="h-5 w-36 rounded-none bg-[#dddddd]" />
                </div>
                <Skeleton className="mt-8 h-px w-full rounded-none bg-[#dddddd]" />
                <div className="mt-8 space-y-2">
                    <Skeleton className="h-4 w-full rounded-none bg-[#dddddd]" />
                    <Skeleton className="h-4 w-[92%] rounded-none bg-[#dddddd]" />
                    <Skeleton className="h-4 w-[88%] rounded-none bg-[#dddddd]" />
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div
                className="flex min-h-screen items-center justify-center bg-[#f4f4f1] px-6 text-center"
                style={{ fontFamily: 'Arial, sans-serif' }}
            >
                <p className="text-sm text-black">
                    Unable to load this event right now.
                </p>
            </div>
        );
    }

    if (!event) {
        return (
            <div
                className="flex min-h-screen items-center justify-center bg-[#f4f4f1]"
                style={{ fontFamily: 'Arial, sans-serif' }}
            >
                <p className="text-sm text-black">Event not found</p>
            </div>
        );
    }

    const primaryLink = getPreferredEventLink(event);
    const primaryLinkUrl =
        primaryLink?.kind === 'tickets'
            ? appendPromoCodeToUrl(primaryLink.url, promoCode)
            : primaryLink?.url ?? null;

    return (
        <div
            className="min-h-screen bg-[#f4f4f1] px-6 pb-24 pt-6 text-black"
            style={{ fontFamily: 'Arial, sans-serif' }}
        >
            <header className="mb-8 grid grid-cols-[24px_1fr_24px] items-center">
                <button
                    onClick={() => router.back()}
                    className="flex h-6 w-6 items-center justify-center text-black active:opacity-60"
                    aria-label="Back"
                >
                    <ChevronLeft className="h-5 w-5" strokeWidth={2.2} />
                </button>
                <div className="flex justify-center">
                    <Image
                        src="/trv-logo.svg"
                        alt="TRV"
                        width={140}
                        height={40}
                        priority
                        className="h-auto w-[140px]"
                    />
                </div>
                <div />
            </header>

            <div className="relative aspect-[3/4] w-full bg-[#ededed]">
                {event.poster ? (
                    <Image
                        src={event.poster.url}
                        alt={event.poster.alt}
                        fill
                        sizes="(max-width: 768px) 100vw, 600px"
                        className="object-cover"
                        priority
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm uppercase tracking-[0.22em] text-[#8c8c8c]">
                        TRV
                    </div>
                )}
            </div>

            <div className="mt-5 space-y-4">
                <div className="space-y-1">
                    <p className="text-[14px] lowercase text-[#b2b2b2]">
                        {event.eventTypeLabel.toLowerCase()} · {event.ageRestriction}
                    </p>
                    <h1 className="text-[28px] leading-none text-black">
                        {event.name}
                    </h1>
                    <p className="text-[16px] leading-tight text-[#7d7d7d]">
                        {new Date(event.startsAt).toLocaleDateString('ru-RU', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                        })}
                    </p>
                    <p className="text-[18px] font-bold leading-tight text-[#7d7d7d]">
                        {[event.city, event.venueName].filter(Boolean).join(' · ') || 'TRV'}
                    </p>
                </div>

                {event.isUpcoming && primaryLink && (
                    <div className="space-y-3">
                        {primaryLink.kind === 'tickets' && (
                            <div className="space-y-1.5">
                                <label className="text-[13px] uppercase tracking-[0.12em] text-[#707070]">
                                    Promo Code
                                </label>
                                <input
                                    placeholder="Enter promo code"
                                    value={promoCode}
                                    onChange={(e) => setPromoCode(e.target.value)}
                                    className="h-[44px] w-full border border-black bg-white px-3 text-[16px] text-black outline-none placeholder:text-[#9d9d9d]"
                                />
                            </div>
                        )}
                        <button
                            type="button"
                            className="flex h-[44px] w-full items-center justify-center border border-black bg-white text-[16px] text-black active:bg-[#ececec]"
                            onClick={() => primaryLinkUrl && openExternalLink(primaryLinkUrl)}
                        >
                            {primaryLink.label}
                        </button>
                    </div>
                )}

                <div className="my-8 h-px w-full bg-black" />

                <p className="text-[16px] leading-[1.5] text-[#202020]">
                    {event.description || 'Описание пока не добавлено.'}
                </p>

                {event.gallery.length > 0 && (
                    <div className="space-y-4 pt-2">
                        <h2 className="text-[13px] uppercase tracking-[0.18em] text-[#707070]">
                            Photos
                        </h2>
                        <div className="grid grid-cols-2 gap-3">
                            {event.gallery.map((photo, i) => (
                                <div key={i} className="relative aspect-[4/3] overflow-hidden bg-[#ededed]">
                                    <Image
                                        src={photo.url}
                                        alt={photo.alt}
                                        fill
                                        sizes="(max-width: 768px) 50vw, 300px"
                                        className="object-cover"
                                        loading="lazy"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
