import { matchesMemberFilter } from '@/domain/config';
import { ArtistDetailViewModel, ArtistListItemViewModel, MemberFilterCategory } from '@/domain/view-models';
import {
    getArtistByIdRepository,
    getArtistsRepository,
    getMerchItemsRepository,
    getReleaseByIdRepository,
    getReleaseContributorsByArtistIdRepository,
    getReleaseContributorsByReleaseIdRepository,
} from '@/lib/repositories/mockRepository';
import {
    mapArtistListItem,
    mapMerchSummary,
    mapReleaseSummary,
} from '@/lib/services/viewModelMappers';

export async function getArtists(
    filter: MemberFilterCategory = 'All'
): Promise<ArtistListItemViewModel[]> {
    const artists = (await getArtistsRepository()).filter(
        (artist) => artist.status === 'published'
    );
    const artistItems = await Promise.all(artists.map(mapArtistListItem));

    return artistItems.filter((artist) =>
        matchesMemberFilter(artist.roleKeys, filter)
    );
}

export async function getArtistById(
    id: string
): Promise<ArtistDetailViewModel | null> {
    const artist = await getArtistByIdRepository(id);
    if (!artist || artist.status !== 'published') {
        return null;
    }

    const [artistItem, allContributions, allMerchItems] = await Promise.all([
        mapArtistListItem(artist),
        getReleaseContributorsByArtistIdRepository(id),
        getMerchItemsRepository(),
    ]);

    const artistReleaseIds = new Set(
        allContributions
            .filter(
                (contribution) =>
                    contribution.contributor_role === 'main' ||
                    contribution.contributor_role === 'featured'
            )
            .map((contribution) => contribution.release_id)
    );
    const supportReleaseIds = new Set(
        allContributions
            .filter(
                (contribution) =>
                    contribution.contributor_role !== 'main' &&
                    contribution.contributor_role !== 'featured'
            )
            .map((contribution) => contribution.release_id)
    );

    const artistReleases = (
        await Promise.all(
            Array.from(artistReleaseIds).map(async (releaseId) => {
                const release = await getReleaseByIdRepository(releaseId);
                if (!release || release.status !== 'published') {
                    return null;
                }

                const contributors = await getReleaseContributorsByReleaseIdRepository(
                    releaseId
                );
                return mapReleaseSummary(release, contributors);
            })
        )
    ).filter(
        (release): release is NonNullable<typeof release> => Boolean(release)
    );

    const supportReleases = (
        await Promise.all(
            Array.from(supportReleaseIds).map(async (releaseId) => {
                const release = await getReleaseByIdRepository(releaseId);
                if (!release || release.status !== 'published') {
                    return null;
                }

                const contributors = await getReleaseContributorsByReleaseIdRepository(
                    releaseId
                );
                return mapReleaseSummary(release, contributors);
            })
        )
    ).filter(
        (release): release is NonNullable<typeof release> => Boolean(release)
    );

    const merchItems = (
        await Promise.all(
            allMerchItems
                .filter(
                    (item) =>
                        item.primary_artist_id === artist.id &&
                        item.status === 'published'
                )
                .map(mapMerchSummary)
        )
    ).filter((item) => Boolean(item));

    return {
        ...artistItem,
        bio: artist.bio,
        artistReleases,
        supportReleases,
        merchItems,
    };
}
