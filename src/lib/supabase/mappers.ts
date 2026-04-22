import { SupabaseClient } from '@supabase/supabase-js';
import {
    ArtistDetailViewModel,
    ArtistListItemViewModel,
    ArtistReferenceViewModel,
    EventDetailViewModel,
    EventSummaryViewModel,
    ExternalLinkViewModel,
    MediaViewModel,
    ReleaseContributorViewModel,
    ReleaseDetailViewModel,
    ReleaseSummaryViewModel,
} from '@/domain/view-models';
import { getReleaseContributorRoleLabel } from '@/domain/config';
import {
    getSupabaseStoragePublicUrl,
    normalizeStoragePath,
} from '@/lib/supabase/media';
import {
    SupabaseArtistRow,
    SupabaseEntityMediaAssignmentRow,
    SupabaseEventRow,
    SupabaseExternalLinkRow,
    SupabaseMediaAssetRow,
    SupabaseMaybeMany,
    SupabaseReleaseContributorRow,
    SupabaseReleaseRow,
} from '@/lib/supabase/types';

function sortByNumber<T>(items: T[], getValue: (item: T) => number) {
    return [...items].sort((a, b) => getValue(a) - getValue(b));
}

function getUpcomingFlag(dateValue: string) {
    return new Date(dateValue).getTime() > Date.now();
}

function unwrapRelation<T>(value: SupabaseMaybeMany<T>) {
    if (Array.isArray(value)) {
        return value[0] ?? null;
    }

    return value ?? null;
}

function mapArtistReference(
    artist: {
        id: string;
        slug: string;
        name: string;
    }
): ArtistReferenceViewModel {
    return {
        id: artist.id,
        slug: artist.slug,
        name: artist.name,
    };
}

function mapExternalLink(
    link: SupabaseExternalLinkRow | null | undefined
): ExternalLinkViewModel | null {
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

function getPrimaryLink(
    links: SupabaseExternalLinkRow[] | null | undefined,
    kind: SupabaseExternalLinkRow['link_kind']
) {
    if (!links || links.length === 0) {
        return null;
    }

    const matchingLinks = links.filter((link) => link.link_kind === kind);
    if (matchingLinks.length === 0) {
        return null;
    }

    return sortByNumber(matchingLinks, (link) =>
        link.is_primary ? -1000 : link.sort_order
    )[0] ?? null;
}

function buildArtistLine(contributors: ReleaseContributorViewModel[]) {
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

function normalizeReleaseContributorRole(
    role: { slug?: string; name?: string }
): ReleaseContributorViewModel['role'] | null {
    const slug = role.slug?.trim().toLowerCase();
    const label = role.name?.trim().toLowerCase();
    const value = slug || label;

    switch (value) {
        case 'main':
        case 'main artist':
        case 'main_artist':
        case 'main-artist':
        case 'artist':
        case 'primary':
        case 'primary artist':
        case 'primary_artist':
        case 'primary-artist':
            return 'main';
        case 'featured':
        case 'featured artist':
        case 'featured_artist':
        case 'featured-artist':
        case 'feature':
        case 'feat':
            return 'featured';
        case 'producer':
            return 'producer';
        case 'designer':
        case 'design':
            return 'designer';
        case 'dj':
            return 'dj';
        default:
            return null;
    }
}

export function resolveMediaAssetUrl(
    supabase: SupabaseClient,
    asset: SupabaseMediaAssetRow | null | undefined
): MediaViewModel | null {
    if (!asset) {
        return null;
    }

    if (asset.external_url) {
        return {
            id: asset.id,
            url: asset.external_url,
            alt: asset.alt_text ?? '',
        };
    }

    if (asset.storage_bucket && asset.storage_path) {
        const normalizedPath = normalizeStoragePath(
            asset.storage_path,
            asset.storage_bucket
        );
        const publicUrl = normalizedPath
            ? supabase.storage.from(asset.storage_bucket).getPublicUrl(normalizedPath)
                  .data.publicUrl
            : getSupabaseStoragePublicUrl(
                  asset.storage_bucket,
                  asset.storage_path
              );
        if (!publicUrl) {
            return null;
        }

        return {
            id: asset.id,
            url: publicUrl,
            alt: asset.alt_text ?? '',
        };
    }

    return null;
}

export function mapArtistRowToListItem(
    supabase: SupabaseClient,
    artist: SupabaseArtistRow
): ArtistListItemViewModel {
    const photo = unwrapRelation(artist.photo);
    const roleAssignments = sortByNumber(
        artist.artist_role_assignments ?? [],
        (assignment) => assignment.sort_order
    ).map((assignment) => ({
        ...assignment,
        role: unwrapRelation(assignment.role),
    })).filter((assignment) => Boolean(assignment.role));

    const roleKeys = roleAssignments
        .map((assignment) => assignment.role?.slug)
        .filter((value): value is NonNullable<typeof value> => Boolean(value));
    const roleLabels = roleAssignments
        .map((assignment) => assignment.role?.name)
        .filter((value): value is NonNullable<typeof value> => Boolean(value));

    return {
        id: artist.id,
        slug: artist.slug,
        name: artist.name,
        photo: resolveMediaAssetUrl(supabase, photo),
        roleKeys: roleKeys as ArtistListItemViewModel['roleKeys'],
        roleLabels,
    };
}

function mapReleaseContributors(
    contributors: SupabaseReleaseContributorRow[] | null | undefined
) {
    return sortByNumber(contributors ?? [], (contributor) => contributor.credit_order)
        .map((contributor) => ({
            ...contributor,
            role: unwrapRelation(contributor.role),
            artist: unwrapRelation(contributor.artist),
            normalizedRole: normalizeReleaseContributorRole({
                slug: contributor.role_slug || unwrapRelation(contributor.role)?.slug,
                name: unwrapRelation(contributor.role)?.name,
            }),
        }))
        .filter(
            (contributor) =>
                Boolean(contributor.artist) &&
                Boolean(contributor.normalizedRole) &&
                contributor.artist?.status === 'published'
        )
        .map(
            (contributor): ReleaseContributorViewModel => ({
                role: contributor.normalizedRole!,
                roleLabel:
                    contributor.role?.name ??
                    getReleaseContributorRoleLabel(contributor.normalizedRole!),
                artist: mapArtistReference(contributor.artist!),
            })
        );
}

export function mapReleaseRowToSummary(
    supabase: SupabaseClient,
    release: SupabaseReleaseRow
): ReleaseSummaryViewModel {
    const releaseType = unwrapRelation(release.release_type);
    const cover = unwrapRelation(release.cover);
    const contributors = mapReleaseContributors(release.release_contributors);

    return {
        id: release.id,
        slug: release.slug,
        title: release.title,
        type: (releaseType?.slug ?? 'single') as ReleaseSummaryViewModel['type'],
        typeLabel: releaseType?.name ?? 'Single',
        cover: resolveMediaAssetUrl(supabase, cover),
        releaseDate: release.release_date,
        artistLine: buildArtistLine(contributors),
        isUpcoming: getUpcomingFlag(release.release_date),
        listenLink: mapExternalLink(getPrimaryLink(release.external_links, 'listen')),
    };
}

export function mapReleaseRowToDetail(
    supabase: SupabaseClient,
    release: SupabaseReleaseRow
): ReleaseDetailViewModel {
    const summary = mapReleaseRowToSummary(supabase, release);
    const contributors = mapReleaseContributors(release.release_contributors);
    const producerNames = contributors
        .filter((contributor) => contributor.role === 'producer')
        .map((contributor) => contributor.artist.name);

    return {
        ...summary,
        description: release.description,
        genres: (release.release_genres ?? [])
            .map((assignment) => assignment.genre)
            .filter((genre): genre is NonNullable<typeof genre> => Boolean(genre)),
        contributors,
        producerLine:
            producerNames.length > 0 ? producerNames.join(', ') : null,
    };
}

export function mapArtistRowToDetail(
    artist: ArtistListItemViewModel,
    bio: string,
    artistReleases: ReleaseSummaryViewModel[],
    supportReleases: ReleaseSummaryViewModel[]
): ArtistDetailViewModel {
    return {
        ...artist,
        bio,
        artistReleases,
        supportReleases,
        merchItems: [],
    };
}

function mapGalleryMedia(
    supabase: SupabaseClient,
    assignments: SupabaseEntityMediaAssignmentRow[]
) {
    return sortByNumber(assignments, (assignment) => assignment.sort_order)
        .map((assignment) => unwrapRelation(assignment.media_asset))
        .filter((asset): asset is NonNullable<typeof asset> => Boolean(asset))
        .map((asset) => resolveMediaAssetUrl(supabase, asset))
        .filter((asset): asset is MediaViewModel => Boolean(asset));
}

export function mapEventRowToSummary(
    supabase: SupabaseClient,
    event: SupabaseEventRow
): EventSummaryViewModel {
    const eventType = unwrapRelation(event.event_type);
    const poster = unwrapRelation(event.poster);

    return {
        id: event.id,
        slug: event.slug,
        name: event.name,
        eventType: (eventType?.slug ?? 'concert') as EventSummaryViewModel['eventType'],
        eventTypeLabel: eventType?.name ?? 'Concert',
        poster: resolveMediaAssetUrl(supabase, poster),
        startsAt: event.starts_at,
        venueName: event.venue_name,
        city: event.city,
        ageRestriction: event.age_restriction,
        isUpcoming: getUpcomingFlag(event.starts_at),
        ticketLink: mapExternalLink(getPrimaryLink(event.external_links, 'tickets')),
        infoLink: mapExternalLink(getPrimaryLink(event.external_links, 'info')),
    };
}

export function mapEventRowToDetail(
    supabase: SupabaseClient,
    event: SupabaseEventRow,
    galleryAssignments: SupabaseEntityMediaAssignmentRow[]
): EventDetailViewModel {
    return {
        ...mapEventRowToSummary(supabase, event),
        description: event.description,
        gallery: mapGalleryMedia(supabase, galleryAssignments),
    };
}
