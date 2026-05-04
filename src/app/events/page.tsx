'use client';

import Image from 'next/image';
import { EventCard } from '@/components/cards/EventCard';
import { EventCardSkeleton } from '@/components/skeletons/EventCardSkeleton';
import { useEvents } from '@/lib/hooks/useEvents';

export default function EventsPage() {
    const { data, isLoading, isError } = useEvents();

    return (
        <div
            className="min-h-screen bg-[#f4f4f1] px-6 pb-24 pt-6 text-black"
            style={{ fontFamily: 'Arial, sans-serif' }}
        >
            <header className="mb-10 flex items-center justify-center">
                <Image
                    src="/trv-logo.svg"
                    alt="TRV"
                    width={140}
                    height={40}
                    priority
                    className="h-auto w-[140px]"
                />
            </header>

            <section className="space-y-4">
                <h2 className="text-[13px] uppercase tracking-[0.18em] text-[#707070]">
                    Upcoming
                </h2>
                {isLoading ? (
                    Array.from({ length: 2 }).map((_, i) => (
                        <EventCardSkeleton key={i} />
                    ))
                ) : isError ? (
                    <p className="border border-black px-4 py-3 text-sm text-black">
                        Unable to load events right now.
                    </p>
                ) : data?.upcoming.length === 0 ? (
                    <p className="border border-black px-4 py-3 text-sm text-black">
                        No upcoming events
                    </p>
                ) : (
                    data?.upcoming.map((event) => (
                        <EventCard key={event.id} event={event} />
                    ))
                )}
            </section>

            <section className="mt-12 space-y-4">
                <h2 className="text-[13px] uppercase tracking-[0.18em] text-[#707070]">
                    Past
                </h2>
                {isLoading ? (
                    Array.from({ length: 2 }).map((_, i) => (
                        <EventCardSkeleton key={i} />
                    ))
                ) : isError ? (
                    <p className="border border-black px-4 py-3 text-sm text-black">
                        Unable to load events right now.
                    </p>
                ) : data?.past.length === 0 ? (
                    <p className="border border-black px-4 py-3 text-sm text-black">
                        No past events
                    </p>
                ) : (
                    data?.past.map((event) => (
                        <EventCard key={event.id} event={event} />
                    ))
                )}
            </section>
        </div>
    );
}
