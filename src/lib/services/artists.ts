import { mockArtists } from '@/data/mockArtists';
import { mockReleaseArtists } from '@/data/mockReleaseArtists';
import { mockReleases } from '@/data/mockReleases';
import { mockGenres } from '@/data/mockGenres';
import { mockMerch } from '@/data/mockMerch';
import {
    Artist,
    ArtistRole,
    ArtistWithRelations,
    ReleaseWithArtists,
    MerchItem,
} from '@/types';

function enrichReleaseForArtist(releaseId: string): ReleaseWithArtists | null {
    const release = mockReleases.find((r) => r.id === releaseId);
    if (!release) return null;

    const raEntries = mockReleaseArtists.filter(
        (ra) => ra.release_id === release.id
    );
    const artists = raEntries
        .map((ra) => {
            const artist = mockArtists.find((a) => a.id === ra.artist_id);
            if (!artist) return null;
            return { artist, role: ra.role };
        })
        .filter(Boolean) as ReleaseWithArtists['artists'];

    const genre = mockGenres.find((g) => g.id === release.genre_id) || {
        id: '',
        name: 'Unknown',
    };

    return { ...release, artists, genre };
}

export async function getArtists(role?: ArtistRole): Promise<Artist[]> {
    if (!role) return mockArtists;
    return mockArtists.filter((a) => a.role === role);
}

export async function getArtistById(
    id: string
): Promise<ArtistWithRelations | null> {
    const artist = mockArtists.find((a) => a.id === id);
    if (!artist) return null;

    // Find all releases where this artist is main or feat
    const mainFeatReleaseIds = mockReleaseArtists
        .filter(
            (ra) =>
                ra.artist_id === id && (ra.role === 'main' || ra.role === 'feat')
        )
        .map((ra) => ra.release_id);

    const releases = mainFeatReleaseIds
        .map((rid) => enrichReleaseForArtist(rid)!)
        .filter(Boolean);

    // Find all releases where this artist is a producer
    const producedReleaseIds = mockReleaseArtists
        .filter((ra) => ra.artist_id === id && ra.role === 'producer')
        .map((ra) => ra.release_id);

    const producedReleases = producedReleaseIds
        .map((rid) => enrichReleaseForArtist(rid)!)
        .filter(Boolean);

    // Find merch associated with this artist
    const merch: MerchItem[] = mockMerch.filter((m) => m.artist_id === id);

    return {
        ...artist,
        releases,
        producedReleases: producedReleases,
        merch,
    };
}
