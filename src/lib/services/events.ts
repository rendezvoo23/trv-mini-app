import { mockEvents } from '@/data/mockEvents';
import { Event } from '@/types';

export async function getEvents(): Promise<{
    upcoming: Event[];
    past: Event[];
}> {
    const upcoming = mockEvents
        .filter((e) => e.is_upcoming)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const past = mockEvents
        .filter((e) => !e.is_upcoming)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return { upcoming, past };
}

export async function getEventById(id: string): Promise<Event | null> {
    return mockEvents.find((e) => e.id === id) || null;
}
