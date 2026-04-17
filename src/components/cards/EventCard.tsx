'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { EventSummaryViewModel } from '@/domain/view-models';

interface EventCardProps {
    event: EventSummaryViewModel;
}

export function EventCard({ event }: EventCardProps) {
    return (
        <Link
            href={`/events/${event.id}`}
            className="block group animate-fade-in"
        >
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-3 bg-muted">
                {event.poster && (
                    <Image
                        src={event.poster.url}
                        alt={event.poster.alt}
                        fill
                        sizes="(max-width: 768px) 100vw, 600px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 space-y-1">
                    <div className="flex items-center gap-2">
                        <Badge className="bg-trv-blue text-white text-[10px] font-bold px-2 py-0.5">
                            {event.eventTypeLabel}
                        </Badge>
                        <Badge className="bg-white/90 text-foreground text-[10px] font-bold px-2 py-0.5">
                            {event.ageRestriction}
                        </Badge>
                    </div>
                    <h3 className="text-white font-bold text-base leading-tight tracking-tight">
                        {event.name}
                    </h3>
                    <p className="text-white/80 text-xs font-medium">
                        {new Date(event.startsAt).toLocaleDateString('ru-RU', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                        })}
                    </p>
                </div>
            </div>
        </Link>
    );
}
