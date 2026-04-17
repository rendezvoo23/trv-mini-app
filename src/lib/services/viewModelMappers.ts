import {
    getArtistRoleLabel,
    getEventTypeLabel,
    getMerchCategoryLabel,
    getReleaseContributorRoleLabel,
    getReleaseTypeLabel,
} from '@/domain/config';
import {
    Artist,
    EntityMediaTargetType,
    Event,
    ExternalLink,
    MediaAsset,
    MerchItem,
    Release,
    ReleaseContributorRole,
} from '@/domain/entities';
import { ReleaseContributor } from '@/domain/relations';
import {
    ArtistListItemViewModel,
    ArtistReferenceViewModel,
    EventDetailViewModel,
    EventSummaryViewModel,
    ExternalLinkViewModel,
    MediaViewModel,
    MerchDetailViewModel,
    MerchSummaryViewModel,
    ReleaseContributorViewModel,
    ReleaseDetailViewModel,
    ReleaseSummaryViewModel,
} from '@/domain/view-models';
import {
    getArtistByIdRepository,
    getArtistRoleAssignmentsByArtistIdRepository,
    getEntityMediaAssignmentsRepository,
    getExternalLinkByKindRepository,
    getMediaAssetByIdRepository,
} from '@/lib/repositories/mockRepository';

function mapMedia(asset: MediaAsset | null): MediaViewModel | null {
    if (!asset) {
        return null;
    }

    return {
        id: asset.id,
        url: asset.url,
        alt: asset.alt_text,
    };
}

function mapLink(link: ExternalLink | null): ExternalLinkViewModel | null {
    if (!link) {
        return null;
    }

    return {
        label: link.label,
        url: link.url,
        kind: link.link_kind,
        provider: link.provider,
    };
}

function isUpcomingDate(dateValue: string) {
    return new Date(dateValue).getTime() > Date.now();
}

async function getGalleryMedia(
    targetType: EntityMediaTargetType,
    targetId: string
): Promise<MediaViewModel[]> {
    const assignments = await getEntityMediaAssignmentsRepository(targetType, targetId);
    const assets = await Promise.all(
        assignments.map((assignment) =>
            getMediaAssetByIdRepository(assignment.media_asset_id)
        )
    );

    return assets
        .filter((asset): asset is MediaAsset => Boolean(asset))
        .map((asset) => mapMedia(asset) as MediaViewModel);
}

async function mapArtistReference(artist: Artist): Promise<ArtistReferenceViewModel> {
    return {
        id: artist.id,
        slug: artist.slug,
        name: artist.name,
    };
}

function buildArtistLine(
    contributors: Array<{ role: ReleaseContributorRole; artist: Artist }>
) {
    const mainArtists = contributors
        .filter((contributor) => contributor.role === 'main')
        .map((contributor) => contributor.artist.name);
    const featuredArtists = contributors
        .filter((contributor) => contributor.role === 'featured')
        .map((contributor) => contributor.artist.name);

    const mainLine = mainArtists.join(', ');
    if (featuredArtists.length === 0) {
        return mainLine;
    }

    return `${mainLine} feat. ${featuredArtists.join(', ')}`;
}

async function getContributorsWithArtists(
    contributors: ReleaseContributor[]
): Promise<Array<{ contributor: ReleaseContributor; artist: Artist }>> {
    const artistPairs = await Promise.all(
        contributors.map(async (contributor) => {
            const artist = await getArtistByIdRepository(contributor.artist_id);
            if (!artist || artist.status !== 'published') {
                return null;
            }

            return { contributor, artist };
        })
    );

    return artistPairs.filter(
        (
            pair
        ): pair is {
            contributor: ReleaseContributor;
            artist: Artist;
        } => Boolean(pair)
    );
}

export async function mapArtistListItem(
    artist: Artist
): Promise<ArtistListItemViewModel> {
    const [photoAsset, roleAssignments] = await Promise.all([
        getMediaAssetByIdRepository(artist.photo_asset_id),
        getArtistRoleAssignmentsByArtistIdRepository(artist.id),
    ]);
    const roleKeys = roleAssignments.map((assignment) => assignment.role_key);

    return {
        id: artist.id,
        slug: artist.slug,
        name: artist.name,
        photo: mapMedia(photoAsset),
        roleKeys,
        roleLabels: roleKeys.map(getArtistRoleLabel),
    };
}

export async function mapReleaseSummary(
    release: Release,
    contributors: ReleaseContributor[]
): Promise<ReleaseSummaryViewModel> {
    const [coverAsset, listenLink, contributorArtists] = await Promise.all([
        getMediaAssetByIdRepository(release.cover_asset_id),
        getExternalLinkByKindRepository('release', release.id, 'listen'),
        getContributorsWithArtists(contributors),
    ]);

    const artistLine = buildArtistLine(
        contributorArtists.map(({ contributor, artist }) => ({
            role: contributor.contributor_role,
            artist,
        }))
    );

    return {
        id: release.id,
        slug: release.slug,
        title: release.title,
        type: release.release_type,
        typeLabel: getReleaseTypeLabel(release.release_type),
        cover: mapMedia(coverAsset),
        releaseDate: release.release_date,
        artistLine: artistLine,
        isUpcoming: isUpcomingDate(release.release_date),
        listenLink: mapLink(listenLink),
    };
}

export async function mapReleaseDetail(
    release: Release,
    contributors: ReleaseContributor[],
    genres: Array<{ id: string; slug: string; name: string }>
): Promise<ReleaseDetailViewModel> {
    const summary = await mapReleaseSummary(release, contributors);
    const contributorArtists = await getContributorsWithArtists(contributors);
    const contributorViewModels: ReleaseContributorViewModel[] = await Promise.all(
        contributorArtists.map(async ({ contributor, artist }) => ({
            role: contributor.contributor_role,
            roleLabel: getReleaseContributorRoleLabel(
                contributor.contributor_role
            ),
            artist: await mapArtistReference(artist),
        }))
    );

    const producers = contributorArtists
        .filter(({ contributor }) => contributor.contributor_role === 'producer')
        .map(({ artist }) => artist.name);

    return {
        ...summary,
        description: release.description,
        genres,
        contributors: contributorViewModels,
        producerLine: producers.length > 0 ? producers.join(', ') : null,
    };
}

export async function mapMerchSummary(
    item: MerchItem
): Promise<MerchSummaryViewModel> {
    const [artist, primaryImage, purchaseLink] = await Promise.all([
        getArtistByIdRepository(item.primary_artist_id),
        getMediaAssetByIdRepository(item.primary_media_asset_id),
        getExternalLinkByKindRepository('merch', item.id, 'purchase'),
    ]);

    return {
        id: item.id,
        slug: item.slug,
        name: item.name,
        category: item.merch_category,
        categoryLabel: getMerchCategoryLabel(item.merch_category),
        artist:
            artist && artist.status === 'published'
                ? await mapArtistReference(artist)
                : null,
        primaryImage: mapMedia(primaryImage),
        releaseDate: item.release_date,
        availability: item.availability,
        isAvailable: item.availability === 'available',
        purchaseLink: mapLink(purchaseLink),
    };
}

export async function mapMerchDetail(
    item: MerchItem
): Promise<MerchDetailViewModel> {
    const [summary, gallery] = await Promise.all([
        mapMerchSummary(item),
        getGalleryMedia('merch', item.id),
    ]);

    return {
        ...summary,
        description: item.description,
        composition: item.composition,
        gallery: summary.primaryImage
            ? [summary.primaryImage, ...gallery]
            : gallery,
    };
}

async function mapEventBase(
    event: Event
): Promise<
    Pick<
        EventSummaryViewModel,
        | 'id'
        | 'slug'
        | 'name'
        | 'eventType'
        | 'eventTypeLabel'
        | 'poster'
        | 'startsAt'
        | 'venueName'
        | 'city'
        | 'ageRestriction'
        | 'isUpcoming'
        | 'ticketLink'
        | 'infoLink'
    >
> {
    const [posterAsset, ticketLink, infoLink] = await Promise.all([
        getMediaAssetByIdRepository(event.poster_asset_id),
        getExternalLinkByKindRepository('event', event.id, 'tickets'),
        getExternalLinkByKindRepository('event', event.id, 'info'),
    ]);

    return {
        id: event.id,
        slug: event.slug,
        name: event.name,
        eventType: event.event_type,
        eventTypeLabel: getEventTypeLabel(event.event_type),
        poster: mapMedia(posterAsset),
        startsAt: event.starts_at,
        venueName: event.venue_name,
        city: event.city,
        ageRestriction: event.age_restriction,
        isUpcoming: isUpcomingDate(event.starts_at),
        ticketLink: mapLink(ticketLink),
        infoLink: mapLink(infoLink),
    };
}

export async function mapEventSummary(event: Event): Promise<EventSummaryViewModel> {
    return mapEventBase(event);
}

export async function mapEventDetail(event: Event): Promise<EventDetailViewModel> {
    const [base, gallery] = await Promise.all([
        mapEventBase(event),
        getGalleryMedia('event', event.id),
    ]);

    return {
        ...base,
        description: event.description,
        gallery,
    };
}

export function sortReleases(
    releases: ReleaseSummaryViewModel[],
    sort: 'newest' | 'oldest'
) {
    return [...releases].sort((a, b) => {
        const dateA = new Date(a.releaseDate).getTime();
        const dateB = new Date(b.releaseDate).getTime();
        return sort === 'newest' ? dateB - dateA : dateA - dateB;
    });
}

export function sortMerchItems(
    items: MerchSummaryViewModel[],
    sort: 'newest' | 'artist' | 'available'
) {
    switch (sort) {
        case 'newest':
            return [...items].sort(
                (a, b) =>
                    new Date(b.releaseDate).getTime() -
                    new Date(a.releaseDate).getTime()
            );
        case 'artist':
            return [...items].sort((a, b) =>
                (a.artist?.name ?? '').localeCompare(b.artist?.name ?? '')
            );
        case 'available':
            return [...items].sort((a, b) => Number(b.isAvailable) - Number(a.isAvailable));
        default:
            return items;
    }
}

export function getPreferredEventLink(
    event: Pick<EventSummaryViewModel, 'ticketLink' | 'infoLink' | 'isUpcoming'>
) {
    if (event.isUpcoming) {
        return event.ticketLink ?? event.infoLink;
    }

    return event.infoLink ?? event.ticketLink;
}
