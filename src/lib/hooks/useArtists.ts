'use client';

import { useQuery } from '@tanstack/react-query';
import { getArtists, getArtistById } from '@/lib/services/artists';
import { MemberFilterCategory } from '@/domain/view-models';

export function useArtists(filter: MemberFilterCategory = 'All') {
    return useQuery({
        queryKey: ['artists', filter],
        queryFn: () => getArtists(filter),
    });
}

export function useArtist(id: string) {
    return useQuery({
        queryKey: ['artist', id],
        queryFn: () => getArtistById(id),
        enabled: !!id,
    });
}
