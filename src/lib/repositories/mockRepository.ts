import {
    EntityMediaTargetType,
    Event,
    ExternalLink,
    ExternalLinkKind,
    ExternalLinkTargetType,
    Genre,
    MediaAsset,
    MerchItem,
    Release,
    Artist,
} from '@/domain/entities';
import {
    ArtistRoleAssignment,
    EntityMediaAssignment,
    ReleaseContributor,
    ReleaseGenreAssignment,
} from '@/domain/relations';
import {
    mockArtists,
    mockArtistRoleAssignments,
    mockEntityMediaAssignments,
    mockEvents,
    mockExternalLinks,
    mockGenres,
    mockMediaAssets,
    mockMerchItems,
    mockReleaseContributors,
    mockReleaseGenreAssignments,
    mockReleases,
} from '@/data/mockDatabase';

function sortByOrder<T extends { sort_order: number }>(items: T[]) {
    return [...items].sort((a, b) => a.sort_order - b.sort_order);
}

function sortLinks(links: ExternalLink[]) {
    return [...links].sort((a, b) => a.sort_order - b.sort_order);
}

function sortAssignments<T extends { sort_order?: number; credit_order?: number }>(
    items: T[]
) {
    return [...items].sort((a, b) => {
        if ('credit_order' in a && 'credit_order' in b) {
            return (a.credit_order ?? 0) - (b.credit_order ?? 0);
        }

        return (a.sort_order ?? 0) - (b.sort_order ?? 0);
    });
}

export async function getArtistsRepository(): Promise<Artist[]> {
    return sortByOrder(mockArtists);
}

export async function getArtistByIdRepository(id: string) {
    return mockArtists.find((artist) => artist.id === id) ?? null;
}

export async function getArtistRoleAssignmentsRepository() {
    return sortAssignments(mockArtistRoleAssignments);
}

export async function getArtistRoleAssignmentsByArtistIdRepository(
    artistId: string
): Promise<ArtistRoleAssignment[]> {
    return sortAssignments(
        mockArtistRoleAssignments.filter((assignment) => assignment.artist_id === artistId)
    );
}

export async function getReleasesRepository(): Promise<Release[]> {
    return sortByOrder(mockReleases);
}

export async function getReleaseByIdRepository(id: string) {
    return mockReleases.find((release) => release.id === id) ?? null;
}

export async function getReleaseContributorsByReleaseIdRepository(
    releaseId: string
): Promise<ReleaseContributor[]> {
    return sortAssignments(
        mockReleaseContributors.filter(
            (contributor) => contributor.release_id === releaseId
        )
    );
}

export async function getReleaseContributorsByArtistIdRepository(
    artistId: string
): Promise<ReleaseContributor[]> {
    return sortAssignments(
        mockReleaseContributors.filter(
            (contributor) => contributor.artist_id === artistId
        )
    );
}

export async function getReleaseGenresByReleaseIdRepository(
    releaseId: string
): Promise<ReleaseGenreAssignment[]> {
    return mockReleaseGenreAssignments.filter(
        (assignment) => assignment.release_id === releaseId
    );
}

export async function getGenreByIdRepository(id: string): Promise<Genre | null> {
    return mockGenres.find((genre) => genre.id === id) ?? null;
}

export async function getMerchItemsRepository(): Promise<MerchItem[]> {
    return sortByOrder(mockMerchItems);
}

export async function getMerchItemByIdRepository(id: string) {
    return mockMerchItems.find((item) => item.id === id) ?? null;
}

export async function getEventsRepository(): Promise<Event[]> {
    return sortByOrder(mockEvents);
}

export async function getEventByIdRepository(id: string) {
    return mockEvents.find((event) => event.id === id) ?? null;
}

export async function getMediaAssetByIdRepository(
    id: string | null
): Promise<MediaAsset | null> {
    if (!id) {
        return null;
    }

    return mockMediaAssets.find((asset) => asset.id === id) ?? null;
}

export async function getEntityMediaAssignmentsRepository(
    targetType: EntityMediaTargetType,
    targetId: string
): Promise<EntityMediaAssignment[]> {
    return sortAssignments(
        mockEntityMediaAssignments.filter(
            (assignment) =>
                assignment.target_type === targetType &&
                assignment.target_id === targetId
        )
    );
}

export async function getExternalLinksRepository(
    targetType: ExternalLinkTargetType,
    targetId: string
): Promise<ExternalLink[]> {
    return sortLinks(
        mockExternalLinks.filter(
            (link) => link.target_type === targetType && link.target_id === targetId
        )
    );
}

export async function getExternalLinkByKindRepository(
    targetType: ExternalLinkTargetType,
    targetId: string,
    kind: ExternalLinkKind
): Promise<ExternalLink | null> {
    return (
        sortLinks(
            mockExternalLinks.filter(
                (link) =>
                    link.target_type === targetType &&
                    link.target_id === targetId &&
                    link.link_kind === kind
            )
        )[0] ?? null
    );
}
