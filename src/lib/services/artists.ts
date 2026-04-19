import { matchesMemberFilter } from '@/domain/config';
import { ArtistDetailViewModel, ArtistListItemViewModel, MemberFilterCategory } from '@/domain/view-models';
import {
    getArtistReleaseContributionRows,
    getPublishedArtistRowById,
    getPublishedArtistRows,
    getPublishedReleaseRowsByIds,
} from '@/lib/repositories/supabaseReadRepository';
import { createClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import {
    mapArtistRowToDetail,
    mapArtistRowToListItem,
    mapReleaseRowToSummary,
} from '@/lib/supabase/mappers';

export async function getArtists(
    filter: MemberFilterCategory = 'All'
): Promise<ArtistListItemViewModel[]> {
    if (!isSupabaseConfigured()) {
        throw new Error('Supabase is not configured for artists.');
    }

    const supabase = createClient();
    const artists = await getPublishedArtistRows(supabase);
    const artistItems = artists.map((artist) =>
        mapArtistRowToListItem(supabase, artist)
    );

    return artistItems.filter((artist) =>
        matchesMemberFilter(artist.roleKeys, filter)
    );
}

export async function getArtistById(
    id: string
): Promise<ArtistDetailViewModel | null> {
    if (!isSupabaseConfigured()) {
        throw new Error('Supabase is not configured for artists.');
    }

    const supabase = createClient();
    const artist = await getPublishedArtistRowById(supabase, id);
    if (!artist) {
        return null;
    }

    const [artistItem, allContributions] = await Promise.all([
        Promise.resolve(mapArtistRowToListItem(supabase, artist)),
        getArtistReleaseContributionRows(supabase, id),
    ]);

    const artistReleaseIds = new Set(
        allContributions
            .filter(
                (contribution) =>
                    contribution.role_slug === 'main' ||
                    contribution.role_slug === 'featured'
            )
            .map((contribution) => contribution.release_id)
    );
    const supportReleaseIds = new Set(
        allContributions
            .filter(
                (contribution) =>
                    contribution.role_slug !== 'main' &&
                    contribution.role_slug !== 'featured'
            )
            .map((contribution) => contribution.release_id)
    );

    const relatedReleaseIds = Array.from(
        new Set([
            ...Array.from(artistReleaseIds),
            ...Array.from(supportReleaseIds),
        ])
    );
    const relatedReleaseRows = await getPublishedReleaseRowsByIds(
        supabase,
        relatedReleaseIds
    );
    const releaseSummaries = relatedReleaseRows.map((release) =>
        mapReleaseRowToSummary(supabase, release)
    );
    const artistReleases = releaseSummaries.filter((release) =>
        artistReleaseIds.has(release.id)
    );

    const supportReleases = releaseSummaries.filter((release) =>
        supportReleaseIds.has(release.id)
    );

    return mapArtistRowToDetail(
        artistItem,
        artist.bio,
        artistReleases,
        supportReleases
    );
}
