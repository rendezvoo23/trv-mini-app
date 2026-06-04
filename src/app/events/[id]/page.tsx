import Image from 'next/image';
import { BackButton } from '@/components/BackButton';
import { EventPrimaryAction } from '@/components/events/EventPrimaryAction';
import { getEventById } from '@/lib/services/events';
import { getPreferredEventLink } from '@/lib/services/viewModelMappers';
import { PUBLIC_DATA_REVALIDATE_SECONDS } from '@/lib/supabase/publicServer';

export const revalidate = PUBLIC_DATA_REVALIDATE_SECONDS;

interface EventDetailPageProps {
    params: {
        id: string;
    };
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
    let event = null;
    let hasError = false;

    try {
        event = await getEventById(params.id);
    } catch {
        hasError = true;
    }

    if (hasError) {
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

    return (
        <div
            className="min-h-screen bg-[#f4f4f1] px-6 pb-24 pt-6 text-black"
            style={{ fontFamily: 'Arial, sans-serif' }}
        >
            <header className="mb-8 grid grid-cols-[24px_1fr_24px] items-center">
                <BackButton />
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
                    <EventPrimaryAction primaryLink={primaryLink} />
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
