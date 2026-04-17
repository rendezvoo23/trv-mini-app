import { EventDetailViewModel, EventSummaryViewModel } from '@/domain/view-models';
import {
    getEventByIdRepository,
    getEventsRepository,
} from '@/lib/repositories/mockRepository';
import { mapEventDetail, mapEventSummary } from '@/lib/services/viewModelMappers';

export async function getEvents(): Promise<{
    upcoming: EventSummaryViewModel[];
    past: EventSummaryViewModel[];
}> {
    const events = (await getEventsRepository()).filter(
        (event) => event.status === 'published'
    );
    const mappedEvents = await Promise.all(events.map(mapEventSummary));

    const upcoming = mappedEvents
        .filter((event) => event.isUpcoming)
        .sort(
            (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()
        );

    const past = mappedEvents
        .filter((event) => !event.isUpcoming)
        .sort(
            (a, b) => new Date(b.startsAt).getTime() - new Date(a.startsAt).getTime()
        );

    return { upcoming, past };
}

export async function getEventById(
    id: string
): Promise<EventDetailViewModel | null> {
    const event = await getEventByIdRepository(id);
    if (!event || event.status !== 'published') {
        return null;
    }

    return mapEventDetail(event);
}
