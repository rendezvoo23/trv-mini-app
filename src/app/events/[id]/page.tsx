'use client';

import { useEvent } from '@/lib/hooks/useEvents';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { openExternalLink } from '@/lib/telegram';
import { useState } from 'react';

export default function EventDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { data: event, isLoading } = useEvent(params.id as string);
    const [promoCode, setPromoCode] = useState('');

    if (isLoading) {
        return (
            <div className="space-y-4 p-4">
                <Skeleton className="aspect-[3/4] rounded-xl" />
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-20 w-full" />
            </div>
        );
    }

    if (!event) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <p className="text-muted-foreground">Event not found</p>
            </div>
        );
    }

    const ticketUrl = promoCode
        ? `${event.ticket_url}?promo=${encodeURIComponent(promoCode)}`
        : event.ticket_url;

    return (
        <div className="animate-fade-in">
            {/* Back button */}
            <div className="px-4 py-3">
                <button
                    onClick={() => router.back()}
                    className="text-sm font-medium text-trv-blue hover:text-trv-blue-dark transition-colors"
                >
                    ← Back
                </button>
            </div>

            {/* Poster */}
            <div className="px-4">
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-muted">
                    <Image
                        src={event.poster_url}
                        alt={event.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 600px"
                        className="object-cover"
                        priority
                    />
                </div>
            </div>

            {/* Info */}
            <div className="px-4 py-5 space-y-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-trv-blue text-white text-xs font-bold px-3 py-1">
                            {event.type}
                        </Badge>
                        <Badge variant="secondary" className="text-xs font-semibold">
                            {event.age_restriction}
                        </Badge>
                        {event.is_upcoming && (
                            <Badge className="bg-green-500 text-white text-xs font-bold px-3 py-1">
                                Upcoming
                            </Badge>
                        )}
                    </div>
                    <h1 className="text-2xl font-black tracking-tight text-foreground">
                        {event.name}
                    </h1>
                    <p className="text-sm font-medium text-muted-foreground mt-1">
                        {new Date(event.date).toLocaleDateString('ru-RU', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                        })}
                    </p>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed">
                    {event.description}
                </p>

                {/* Photo Gallery */}
                {event.photos.length > 0 && (
                    <div className="space-y-3">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-trv-blue">
                            Photos
                        </h2>
                        <div className="grid grid-cols-2 gap-2">
                            {event.photos.map((photo, i) => (
                                <div
                                    key={i}
                                    className="relative aspect-[4/3] rounded-xl overflow-hidden bg-muted"
                                >
                                    <Image
                                        src={photo}
                                        alt={`${event.name} photo ${i + 1}`}
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

                {/* Promo Code + Ticket Button */}
                {event.is_upcoming && (
                    <div className="space-y-3 pt-2">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                                Promo Code
                            </label>
                            <Input
                                placeholder="Enter promo code"
                                value={promoCode}
                                onChange={(e) => setPromoCode(e.target.value)}
                                className="rounded-xl h-11"
                            />
                        </div>
                        <Button
                            className="w-full bg-trv-blue hover:bg-trv-blue-dark text-white font-bold rounded-xl h-12 text-base"
                            onClick={() => openExternalLink(ticketUrl)}
                        >
                            Buy Tickets
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
