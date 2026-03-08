'use client';

import { useQuery } from '@tanstack/react-query';
import { getArtists, getArtistById } from '@/lib/services/artists';
import { ArtistRole } from '@/types';

export function useArtists(role?: ArtistRole) {
    return useQuery({
        queryKey: ['artists', role ?? 'all'],
        queryFn: () => getArtists(role),
    });
}

export function useArtist(id: string) {
    return useQuery({
        queryKey: ['artist', id],
        queryFn: () => getArtistById(id),
        enabled: !!id,
    });
}
