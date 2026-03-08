'use client';

import { useQuery } from '@tanstack/react-query';
import { getEvents, getEventById } from '@/lib/services/events';

export function useEvents() {
    return useQuery({
        queryKey: ['events'],
        queryFn: getEvents,
    });
}

export function useEvent(id: string) {
    return useQuery({
        queryKey: ['event', id],
        queryFn: () => getEventById(id),
        enabled: !!id,
    });
}
