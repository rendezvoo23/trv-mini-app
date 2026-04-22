import { getReleaseTypeLabel } from '@/domain/config';
import { ReleaseType } from '@/domain/entities';
import { getAdminDbClient } from '@/lib/admin/auth';
import {
    FALLBACK_ARTIST_ROLE_OPTIONS,
} from '@/lib/admin/options';
import {
    AdminArtistFormData,
    AdminArtistListItem,
    AdminArtistOption,
    AdminAssetPreview,
    AdminEventFormData,
    AdminEventListItem,
    AdminExternalLinkInput,
    AdminOption,
    AdminReleaseFormData,
    AdminReleaseListItem,
} from '@/lib/admin/types';
import { getSupabaseStoragePublicUrl } from '@/lib/supabase/media';
import { SupabaseMaybeMany } from '@/lib/supabase/types';

interface AdminAssetRow {
    id: string;
    external_url: string | null;
    storage_bucket: string | null;
    storage_path: string | null;
    alt_text: string | null;
}

interface AdminLookupNameRow {
    name: string;
}

interface AdminArtistRoleAssignmentRow {
    role_slug: string;
    sort_order: number;
    role: SupabaseMaybeMany<AdminLookupNameRow>;
}

interface AdminArtistListRow {
    id: string;
    name: string;
    slug: string;
    status: 'draft' | 'published' | 'archived';
    updated_at: string | null;
    photo: SupabaseMaybeMany<AdminAssetRow>;
    artist_role_assignments: AdminArtistRoleAssignmentRow[] | null;
}

interface AdminArtistOptionRow {
    id: string;
    name: string;
    slug: string;
}

interface AdminArtistFormRow {
    id: string;
    name: string;
    slug: string;
    bio: string;
    status: 'draft' | 'published' | 'archived';
    sort_order: number | null;
    photo_asset_id: string | null;
    updated_at: string | null;
    photo: SupabaseMaybeMany<AdminAssetRow>;
    artist_role_assignments: Array<{
        role_slug: string;
        sort_order: number;
    }> | null;
}

interface AdminGenreOptionRow {
    id: string;
    name: string;
}

interface AdminReleaseListRow {
    id: string;
    title: string;
    slug: string;
    release_type_slug: ReleaseType | null;
    release_date: string;
    status: 'draft' | 'published' | 'archived';
    updated_at: string | null;
    cover: SupabaseMaybeMany<AdminAssetRow>;
}

interface AdminReleaseContributorRow {
    artist_id: string;
    role_slug: string;
    credit_order: number;
}

interface AdminReleaseGenreRow {
    genre_id: string;
}

interface AdminExternalLinkRow {
    label: string;
    url: string;
    link_kind: 'listen' | 'purchase' | 'tickets' | 'info';
    provider: string | null;
    sort_order: number;
    is_primary?: boolean | null;
}

interface AdminReleaseFormRow {
    id: string;
    title: string;
    slug: string;
    description: string;
    release_type_slug: ReleaseType | null;
    release_date: string;
    status: 'draft' | 'published' | 'archived';
    sort_order: number | null;
    cover_asset_id: string | null;
    updated_at: string | null;
    cover: SupabaseMaybeMany<AdminAssetRow>;
    release_contributors: AdminReleaseContributorRow[] | null;
    release_genres: AdminReleaseGenreRow[] | null;
    external_links: AdminExternalLinkRow[] | null;
}

interface AdminEventListRow {
    id: string;
    name: string;
    slug: string;
    starts_at: string;
    venue_name: string;
    city: string;
    status: 'draft' | 'published' | 'archived';
    updated_at: string | null;
    poster: SupabaseMaybeMany<AdminAssetRow>;
}

interface AdminEventFormRow {
    id: string;
    name: string;
    slug: string;
    description: string;
    event_type_slug: string | null;
    starts_at: string;
    ends_at: string | null;
    venue_name: string;
    city: string;
    age_restriction: string | null;
    status: 'draft' | 'published' | 'archived';
    sort_order: number | null;
    poster_asset_id: string | null;
    updated_at: string | null;
    poster: SupabaseMaybeMany<AdminAssetRow>;
    external_links: AdminExternalLinkRow[] | null;
}

interface ExternalLinkInsertRow {
    release_id: string | null;
    event_id: string | null;
    merch_item_id: string | null;
    link_kind: 'listen' | 'purchase' | 'tickets' | 'info';
    label: string;
    provider: string | null;
    url: string;
    sort_order: number;
    is_primary: boolean;
}

function unwrapRelation<T>(value: SupabaseMaybeMany<T> | undefined): T | null {
    if (Array.isArray(value)) {
        return value[0] ?? null;
    }

    return value ?? null;
}

function mapAssetPreview(
    asset: SupabaseMaybeMany<AdminAssetRow> | null | undefined
): AdminAssetPreview | null {
    const resolvedAsset = unwrapRelation(asset);

    if (!resolvedAsset) {
        return null;
    }

    const externalUrl = resolvedAsset.external_url?.trim();
    const url =
        externalUrl && externalUrl.length > 0
            ? externalUrl
            : getSupabaseStoragePublicUrl(
                  resolvedAsset.storage_bucket ?? null,
                  resolvedAsset.storage_path ?? null
              );

    if (!url) {
        return null;
    }

    return {
        id: resolvedAsset.id,
        url,
        alt: resolvedAsset.alt_text ?? '',
    };
}

async function getExistingPublishedAt(
    db: Awaited<ReturnType<typeof getAdminDbClient>>,
    table: 'artists' | 'releases' | 'events',
    id: string
) {
    const { data } = await db
        .from(table)
        .select('published_at')
        .eq('id', id)
        .maybeSingle();

    return data?.published_at ?? null;
}

async function resolvePublishedAt(
    db: Awaited<ReturnType<typeof getAdminDbClient>>,
    table: 'artists' | 'releases' | 'events',
    id: string | null,
    status: 'draft' | 'published' | 'archived'
) {
    if (status === 'draft') {
        return null;
    }

    if (!id) {
        return status === 'published' ? new Date().toISOString() : null;
    }

    const currentPublishedAt = await getExistingPublishedAt(db, table, id);
    if (status === 'published') {
        return currentPublishedAt ?? new Date().toISOString();
    }

    return currentPublishedAt;
}

async function syncMediaAltText(
    db: Awaited<ReturnType<typeof getAdminDbClient>>,
    assetId: string | null,
    altText: string
) {
    if (!assetId) {
        return;
    }

    await db.from('media_assets').update({ alt_text: altText }).eq('id', assetId);
}

export async function listAdminArtistRoleOptions(): Promise<AdminOption[]> {
    const db = await getAdminDbClient();
    const { data, error } = await db
        .from('artist_roles')
        .select('slug, name, sort_order')
        .order('sort_order', { ascending: true });

    if (error) {
        throw error;
    }

    if (!data || data.length === 0) {
        return FALLBACK_ARTIST_ROLE_OPTIONS;
    }

    return data.map((role: { slug: string; name: string }) => ({
        value: role.slug,
        label: role.name,
    }));
}

export async function listAdminArtists(): Promise<AdminArtistListItem[]> {
    const db = await getAdminDbClient();
    const { data, error } = await db
        .from('artists')
        .select(
            `
                id,
                name,
                slug,
                status,
                updated_at,
                photo:media_assets!artists_photo_asset_id_fkey(
                    id,
                    external_url,
                    storage_bucket,
                    storage_path,
                    alt_text
                ),
                artist_role_assignments(
                    role_slug,
                    sort_order,
                    role:artist_roles!artist_role_assignments_role_slug_fkey(
                        name
                    )
                )
            `
        )
        .order('sort_order', { ascending: true });

    if (error) {
        throw error;
    }

    const artists = (data ?? []) as AdminArtistListRow[];

    return artists.map((artist) => ({
        id: artist.id,
        name: artist.name,
        slug: artist.slug,
        status: artist.status,
        roleLabels: (artist.artist_role_assignments ?? [])
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((assignment) => unwrapRelation(assignment.role)?.name ?? assignment.role_slug),
        photo: mapAssetPreview(artist.photo),
        updatedAt: artist.updated_at ?? null,
    }));
}

export async function listAdminArtistOptions(): Promise<AdminArtistOption[]> {
    const db = await getAdminDbClient();
    const { data, error } = await db
        .from('artists')
        .select('id, name, slug')
        .order('name', { ascending: true });

    if (error) {
        throw error;
    }

    const artists = (data ?? []) as AdminArtistOptionRow[];

    return artists.map((artist) => ({
        id: artist.id,
        name: artist.name,
        slug: artist.slug,
    }));
}

export async function getAdminArtistFormData(
    id: string
): Promise<AdminArtistFormData | null> {
    const db = await getAdminDbClient();
    const { data, error } = await db
        .from('artists')
        .select(
            `
                id,
                name,
                slug,
                bio,
                status,
                sort_order,
                photo_asset_id,
                updated_at,
                photo:media_assets!artists_photo_asset_id_fkey(
                    id,
                    external_url,
                    storage_bucket,
                    storage_path,
                    alt_text
                ),
                artist_role_assignments(
                    role_slug,
                    sort_order
                )
            `
        )
        .eq('id', id)
        .maybeSingle();

    if (error) {
        throw error;
    }

    const artist = data as AdminArtistFormRow | null;

    if (!artist) {
        return null;
    }

    return {
        id: artist.id,
        name: artist.name,
        slug: artist.slug,
        bio: artist.bio,
        status: artist.status,
        sortOrder: artist.sort_order ?? 0,
        roleSlugs: (artist.artist_role_assignments ?? [])
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((assignment) => assignment.role_slug),
        photoAssetId: artist.photo_asset_id,
        photo: mapAssetPreview(artist.photo),
        updatedAt: artist.updated_at ?? null,
    };
}

export async function saveAdminArtist(input: {
    id: string | null;
    name: string;
    slug: string;
    bio: string;
    status: 'draft' | 'published' | 'archived';
    sortOrder: number;
    roleSlugs: string[];
    photoAssetId: string | null;
}) {
    const db = await getAdminDbClient();
    const publishedAt = await resolvePublishedAt(
        db,
        'artists',
        input.id,
        input.status
    );
    const payload = {
        name: input.name,
        slug: input.slug,
        bio: input.bio,
        status: input.status,
        sort_order: input.sortOrder,
        published_at: publishedAt,
        photo_asset_id: input.photoAssetId,
    };

    const artistResult = input.id
        ? await db
              .from('artists')
              .update(payload)
              .eq('id', input.id)
              .select('id')
              .single()
        : await db.from('artists').insert(payload).select('id').single();

    if (artistResult.error) {
        throw artistResult.error;
    }

    const artistId = artistResult.data.id;

    const deleteResult = await db
        .from('artist_role_assignments')
        .delete()
        .eq('artist_id', artistId);

    if (deleteResult.error) {
        throw deleteResult.error;
    }

    if (input.roleSlugs.length > 0) {
        const roleInsertResult = await db.from('artist_role_assignments').insert(
            input.roleSlugs.map((roleSlug, index) => ({
                artist_id: artistId,
                role_slug: roleSlug,
                sort_order: index + 1,
            }))
        );

        if (roleInsertResult.error) {
            throw roleInsertResult.error;
        }
    }

    await syncMediaAltText(db, input.photoAssetId, input.name);

    return artistId;
}

export async function listAdminGenreOptions(): Promise<AdminOption[]> {
    const db = await getAdminDbClient();
    const { data, error } = await db
        .from('genres')
        .select('id, name, sort_order')
        .order('sort_order', { ascending: true });

    if (error) {
        throw error;
    }

    const genres = (data ?? []) as AdminGenreOptionRow[];

    return genres.map((genre) => ({
        value: genre.id,
        label: genre.name,
    }));
}

export async function listAdminReleases(): Promise<AdminReleaseListItem[]> {
    const db = await getAdminDbClient();
    const { data, error } = await db
        .from('releases')
        .select(
            `
                id,
                title,
                slug,
                release_type_slug,
                release_date,
                status,
                updated_at,
                cover:media_assets!releases_cover_asset_id_fkey(
                    id,
                    external_url,
                    storage_bucket,
                    storage_path,
                    alt_text
                )
            `
        )
        .order('release_date', { ascending: false });

    if (error) {
        throw error;
    }

    const releases = (data ?? []) as AdminReleaseListRow[];

    return releases.map((release) => ({
        id: release.id,
        title: release.title,
        slug: release.slug,
        type: getReleaseTypeLabel(release.release_type_slug ?? 'single'),
        releaseDate: release.release_date,
        status: release.status,
        cover: mapAssetPreview(release.cover),
        updatedAt: release.updated_at ?? null,
    }));
}

export async function getAdminReleaseFormData(
    id: string
): Promise<AdminReleaseFormData | null> {
    const db = await getAdminDbClient();
    const { data, error } = await db
        .from('releases')
        .select(
            `
                id,
                title,
                slug,
                description,
                release_type_slug,
                release_date,
                status,
                sort_order,
                cover_asset_id,
                updated_at,
                cover:media_assets!releases_cover_asset_id_fkey(
                    id,
                    external_url,
                    storage_bucket,
                    storage_path,
                    alt_text
                ),
                release_contributors(
                    artist_id,
                    role_slug,
                    credit_order,
                    artist:artists!release_contributors_artist_id_fkey(
                        id,
                        name
                    )
                ),
                release_genres(
                    genre_id
                ),
                external_links(
                    label,
                    url,
                    link_kind,
                    provider,
                    sort_order,
                    is_primary
                )
            `
        )
        .eq('id', id)
        .maybeSingle();

    if (error) {
        throw error;
    }

    const release = data as AdminReleaseFormRow | null;

    if (!release) {
        return null;
    }

    return {
        id: release.id,
        title: release.title,
        slug: release.slug,
        description: release.description,
        releaseTypeSlug: release.release_type_slug ?? 'single',
        releaseDate: release.release_date,
        status: release.status,
        sortOrder: release.sort_order ?? 0,
        coverAssetId: release.cover_asset_id,
        cover: mapAssetPreview(release.cover),
        contributorRows: (release.release_contributors ?? [])
            .sort((a, b) => a.credit_order - b.credit_order)
            .map((contributor) => ({
                artistId: contributor.artist_id,
                roleSlug: contributor.role_slug,
                creditOrder: contributor.credit_order,
            })),
        genreIds: (release.release_genres ?? []).map((genre) => genre.genre_id),
        links: (release.external_links ?? [])
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((link) => ({
                label: link.label,
                url: link.url,
                kind: link.link_kind,
                provider: link.provider,
                isPrimary: Boolean(link.is_primary),
                sortOrder: link.sort_order,
            })),
        updatedAt: release.updated_at ?? null,
    };
}

export async function saveAdminRelease(input: {
    id: string | null;
    title: string;
    slug: string;
    description: string;
    releaseTypeSlug: string;
    releaseDate: string;
    status: 'draft' | 'published' | 'archived';
    sortOrder: number;
    coverAssetId: string | null;
    contributorRows: Array<{
        artistId: string;
        roleSlug: string;
        creditOrder: number;
    }>;
    genreIds: string[];
    links: AdminExternalLinkInput[];
}) {
    const db = await getAdminDbClient();
    const publishedAt = await resolvePublishedAt(
        db,
        'releases',
        input.id,
        input.status
    );
    const payload = {
        title: input.title,
        slug: input.slug,
        description: input.description,
        release_type_slug: input.releaseTypeSlug,
        release_date: input.releaseDate,
        cover_asset_id: input.coverAssetId,
        status: input.status,
        published_at: publishedAt,
        sort_order: input.sortOrder,
    };

    const releaseResult = input.id
        ? await db
              .from('releases')
              .update(payload)
              .eq('id', input.id)
              .select('id')
              .single()
        : await db.from('releases').insert(payload).select('id').single();

    if (releaseResult.error) {
        throw releaseResult.error;
    }

    const releaseId = releaseResult.data.id;

    const [
        contributorDeleteResult,
        genreDeleteResult,
        linkDeleteResult,
    ] = await Promise.all([
        db.from('release_contributors').delete().eq('release_id', releaseId),
        db.from('release_genres').delete().eq('release_id', releaseId),
        db.from('external_links').delete().eq('release_id', releaseId),
    ]);

    if (contributorDeleteResult.error) {
        throw contributorDeleteResult.error;
    }

    if (genreDeleteResult.error) {
        throw genreDeleteResult.error;
    }

    if (linkDeleteResult.error) {
        throw linkDeleteResult.error;
    }

    if (input.contributorRows.length > 0) {
        const contributorInsertResult = await db.from('release_contributors').insert(
            input.contributorRows.map((contributor, index) => ({
                release_id: releaseId,
                artist_id: contributor.artistId,
                role_slug: contributor.roleSlug,
                credit_order: contributor.creditOrder || index + 1,
            }))
        );

        if (contributorInsertResult.error) {
            throw contributorInsertResult.error;
        }
    }

    if (input.genreIds.length > 0) {
        const genreInsertResult = await db.from('release_genres').insert(
            input.genreIds.map((genreId) => ({
                release_id: releaseId,
                genre_id: genreId,
            }))
        );

        if (genreInsertResult.error) {
            throw genreInsertResult.error;
        }
    }

    if (input.links.length > 0) {
        const linkInsertResult = await db.from('external_links').insert(
            input.links.map((link, index) => ({
                release_id: releaseId,
                merch_item_id: null,
                event_id: null,
                link_kind: link.kind,
                label: link.label,
                provider: link.provider,
                url: link.url,
                sort_order: link.sortOrder || index + 1,
                is_primary: link.isPrimary,
            }))
        );

        if (linkInsertResult.error) {
            throw linkInsertResult.error;
        }
    }

    await syncMediaAltText(db, input.coverAssetId, input.title);

    return releaseId;
}

export async function listAdminEvents(): Promise<AdminEventListItem[]> {
    const db = await getAdminDbClient();
    const { data, error } = await db
        .from('events')
        .select(
            `
                id,
                name,
                slug,
                event_type_slug,
                starts_at,
                venue_name,
                city,
                status,
                updated_at,
                poster:media_assets!events_poster_asset_id_fkey(
                    id,
                    external_url,
                    storage_bucket,
                    storage_path,
                    alt_text
                )
            `
        )
        .order('starts_at', { ascending: false });

    if (error) {
        throw error;
    }

    const events = (data ?? []) as AdminEventListRow[];

    return events.map((event) => ({
        id: event.id,
        name: event.name,
        slug: event.slug,
        startsAt: event.starts_at,
        city: event.city,
        venueName: event.venue_name,
        status: event.status,
        poster: mapAssetPreview(event.poster),
        updatedAt: event.updated_at ?? null,
    }));
}

export async function getAdminEventFormData(
    id: string
): Promise<AdminEventFormData | null> {
    const db = await getAdminDbClient();
    const { data, error } = await db
        .from('events')
        .select(
            `
                id,
                name,
                slug,
                description,
                event_type_slug,
                starts_at,
                ends_at,
                venue_name,
                city,
                age_restriction,
                status,
                sort_order,
                poster_asset_id,
                updated_at,
                poster:media_assets!events_poster_asset_id_fkey(
                    id,
                    external_url,
                    storage_bucket,
                    storage_path,
                    alt_text
                ),
                external_links(
                    label,
                    url,
                    link_kind,
                    provider,
                    sort_order
                )
            `
        )
        .eq('id', id)
        .maybeSingle();

    if (error) {
        throw error;
    }

    const event = data as AdminEventFormRow | null;

    if (!event) {
        return null;
    }

    const ticketLink = (event.external_links ?? []).find(
        (link) => link.link_kind === 'tickets'
    );
    const infoLink = (event.external_links ?? []).find(
        (link) => link.link_kind === 'info'
    );

    return {
        id: event.id,
        name: event.name,
        slug: event.slug,
        description: event.description,
        eventTypeSlug: event.event_type_slug ?? 'concert',
        startsAt: event.starts_at,
        endsAt: event.ends_at,
        venueName: event.venue_name,
        city: event.city,
        ageRestriction: event.age_restriction ?? '18+',
        status: event.status,
        sortOrder: event.sort_order ?? 0,
        posterAssetId: event.poster_asset_id,
        poster: mapAssetPreview(event.poster),
        ticketLabel: ticketLink?.label ?? 'Buy Tickets',
        ticketUrl: ticketLink?.url ?? '',
        infoLabel: infoLink?.label ?? 'Info',
        infoUrl: infoLink?.url ?? '',
        updatedAt: event.updated_at ?? null,
    };
}

export async function saveAdminEvent(input: {
    id: string | null;
    name: string;
    slug: string;
    description: string;
    eventTypeSlug: string;
    startsAt: string;
    endsAt: string | null;
    venueName: string;
    city: string;
    ageRestriction: string;
    status: 'draft' | 'published' | 'archived';
    sortOrder: number;
    posterAssetId: string | null;
    ticketLabel: string;
    ticketUrl: string;
    infoLabel: string;
    infoUrl: string;
}) {
    const db = await getAdminDbClient();
    const publishedAt = await resolvePublishedAt(
        db,
        'events',
        input.id,
        input.status
    );
    const payload = {
        name: input.name,
        slug: input.slug,
        description: input.description,
        event_type_slug: input.eventTypeSlug,
        starts_at: input.startsAt,
        ends_at: input.endsAt,
        venue_name: input.venueName,
        city: input.city,
        age_restriction: input.ageRestriction,
        status: input.status,
        published_at: publishedAt,
        sort_order: input.sortOrder,
        poster_asset_id: input.posterAssetId,
    };

    const eventResult = input.id
        ? await db
              .from('events')
              .update(payload)
              .eq('id', input.id)
              .select('id')
              .single()
        : await db.from('events').insert(payload).select('id').single();

    if (eventResult.error) {
        throw eventResult.error;
    }

    const eventId = eventResult.data.id;

    const linkDeleteResult = await db
        .from('external_links')
        .delete()
        .eq('event_id', eventId);

    if (linkDeleteResult.error) {
        throw linkDeleteResult.error;
    }

    const linksToInsert: ExternalLinkInsertRow[] = [];

    if (input.ticketUrl) {
        linksToInsert.push({
            event_id: eventId,
            release_id: null,
            merch_item_id: null,
            link_kind: 'tickets',
            label: input.ticketLabel,
            provider: null,
            url: input.ticketUrl,
            sort_order: 1,
            is_primary: true,
        });
    }

    if (input.infoUrl) {
        linksToInsert.push({
            event_id: eventId,
            release_id: null,
            merch_item_id: null,
            link_kind: 'info',
            label: input.infoLabel,
            provider: null,
            url: input.infoUrl,
            sort_order: 2,
            is_primary: !input.ticketUrl,
        });
    }

    if (linksToInsert.length > 0) {
        const linkInsertResult = await db.from('external_links').insert(linksToInsert);

        if (linkInsertResult.error) {
            throw linkInsertResult.error;
        }
    }

    await syncMediaAltText(db, input.posterAssetId, input.name);

    return eventId;
}
