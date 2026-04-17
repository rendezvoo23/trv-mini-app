'use client';

import { useQuery } from '@tanstack/react-query';
import { getReleases, getReleaseById } from '@/lib/services/releases';
import { ReleaseSort } from '@/domain/view-models';

export function useReleases(sort: ReleaseSort = 'newest') {
    return useQuery({
        queryKey: ['releases', sort],
        queryFn: () => getReleases(sort),
    });
}

export function useRelease(id: string) {
    return useQuery({
        queryKey: ['release', id],
        queryFn: () => getReleaseById(id),
        enabled: !!id,
    });
}
