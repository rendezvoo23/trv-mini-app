import { SupabaseClient } from '@supabase/supabase-js';
import {
    ArtistDetailViewModel,
    ArtistListItemViewModel,
    ArtistReferenceViewModel,
    ExternalLinkViewModel,
    MediaViewModel,
    ReleaseContributorViewModel,
    ReleaseDetailViewModel,
    ReleaseSummaryViewModel,
} from '@/domain/view-models';
import {
    SupabaseArtistRow,
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
        const { data } = supabase.storage
            .from(asset.storage_bucket)
            .getPublicUrl(asset.storage_path);

        return {
            id: asset.id,
            url: data.publicUrl,
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
        }))
        .filter(
            (contributor) =>
                Boolean(contributor.artist) &&
                Boolean(contributor.role) &&
                contributor.artist?.status === 'published'
        )
        .map(
            (contributor): ReleaseContributorViewModel => ({
                role: contributor.role!.slug as ReleaseContributorViewModel['role'],
                roleLabel: contributor.role!.name,
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
