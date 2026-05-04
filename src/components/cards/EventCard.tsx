'use client';

import Image from 'next/image';
import Link from 'next/link';
import { EventSummaryViewModel } from '@/domain/view-models';

interface EventCardProps {
    event: EventSummaryViewModel;
}

export function EventCard({ event }: EventCardProps) {
    return (
        <article
            className="border border-black bg-white p-2 text-black"
            style={{ fontFamily: 'Arial, sans-serif' }}
        >
            <div className="grid grid-cols-[165px_minmax(0,1fr)] gap-4">
                <Link href={`/events/${event.id}`} className="block">
                    <div className="relative aspect-square overflow-hidden bg-[#f1f1f1]">
                        {event.poster ? (
                            <Image
                                src={event.poster.url}
                                alt={event.poster.alt}
                                fill
                                sizes="165px"
                                className="object-cover"
                                loading="lazy"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs uppercase tracking-[0.2em] text-[#8a8a8a]">
                                TRV
                            </div>
                        )}
                    </div>
                </Link>

                <Link
                    href={`/events/${event.id}`}
                    className="flex min-w-0 flex-col justify-center pr-1"
                >
                    <span className="mb-1 text-[14px] lowercase text-[#b4b4b4]">
                        {event.eventTypeLabel.toLowerCase()}
                    </span>
                    <h3 className="text-[20px] leading-[1.05] text-black">
                        {event.name}
                    </h3>
                    <p className="mt-1 text-[16px] leading-tight text-[#7d7d7d]">
                        {new Date(event.startsAt).toLocaleDateString('ru-RU', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                        })}
                    </p>
                    <p className="mt-1 text-[16px] font-bold leading-tight text-[#7d7d7d]">
                        {[event.city, event.venueName].filter(Boolean).join(' · ') || 'TRV'}
                    </p>
                </Link>
            </div>

            <div className="mt-6">
                <Link
                    href={`/events/${event.id}`}
                    className="flex h-[42px] w-full items-center justify-center border border-black bg-white text-[16px] text-black transition-colors active:bg-[#ececec]"
                >
                    Подробнее
                </Link>
            </div>
        </article>
    );
}
