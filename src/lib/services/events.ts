import { EventDetailViewModel, EventSummaryViewModel } from '@/domain/view-models';
import {
    getEventGalleryAssignments,
    getPublishedEventRowById,
    getPublishedEventRows,
} from '@/lib/repositories/supabaseReadRepository';
import { createClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import {
    mapEventRowToDetail,
    mapEventRowToSummary,
} from '@/lib/supabase/mappers';

export async function getEvents(): Promise<{
    upcoming: EventSummaryViewModel[];
    past: EventSummaryViewModel[];
}> {
    if (!isSupabaseConfigured()) {
        throw new Error('Supabase is not configured for events.');
    }

    const supabase = createClient();
    const eventRows = await getPublishedEventRows(supabase);
    const mappedEvents = eventRows.map((event) =>
        mapEventRowToSummary(supabase, event)
    );

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
    if (!isSupabaseConfigured()) {
        throw new Error('Supabase is not configured for events.');
    }

    const supabase = createClient();
    const event = await getPublishedEventRowById(supabase, id);
    if (!event) {
        return null;
    }

    const galleryAssignments = await getEventGalleryAssignments(supabase, id);
    return mapEventRowToDetail(supabase, event, galleryAssignments);
}
