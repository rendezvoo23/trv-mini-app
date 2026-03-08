'use client';

import { useEvents } from '@/lib/hooks/useEvents';
import { EventCard } from '@/components/cards/EventCard';
import { EventCardSkeleton } from '@/components/skeletons/EventCardSkeleton';

export default function EventsPage() {
    const { data, isLoading } = useEvents();

    return (
        <div className="space-y-6 pt-4">
            {/* Upcoming Events */}
            <section className="px-4 space-y-4">
                <h2 className="text-xs font-bold uppercase tracking-widest text-trv-blue">
                    Upcoming
                </h2>
                {isLoading ? (
                    Array.from({ length: 2 }).map((_, i) => (
                        <EventCardSkeleton key={i} />
                    ))
                ) : data?.upcoming.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-4">
                        No upcoming events
                    </p>
                ) : (
                    data?.upcoming.map((event) => (
                        <EventCard key={event.id} event={event} />
                    ))
                )}
            </section>

            {/* Past Events */}
            <section className="px-4 space-y-4 pb-4">
                <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Past
                </h2>
                {isLoading ? (
                    Array.from({ length: 2 }).map((_, i) => (
                        <EventCardSkeleton key={i} />
                    ))
                ) : data?.past.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-4">No past events</p>
                ) : (
                    data?.past.map((event) => (
                        <EventCard key={event.id} event={event} />
                    ))
                )}
            </section>
        </div>
    );
}
