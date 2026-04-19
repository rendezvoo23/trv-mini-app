import { SupabaseClient } from '@supabase/supabase-js';
import {
    SupabaseArtistReleaseContributionRow,
    SupabaseArtistRow,
    SupabaseReleaseRow,
} from '@/lib/supabase/types';

const RELEASE_SELECT = `
    id,
    slug,
    title,
    description,
    release_date,
    status,
    published_at,
    sort_order,
    release_type:release_types!releases_release_type_slug_fkey(
        slug,
        name,
        sort_order
    ),
    cover:media_assets!releases_cover_asset_id_fkey(
        id,
        media_kind,
        storage_bucket,
        storage_path,
        external_url,
        alt_text,
        width,
        height
    ),
    release_contributors(
        credit_order,
        role:release_contributor_roles!release_contributors_role_slug_fkey(
            slug,
            name,
            sort_order
        ),
        artist:artists!release_contributors_artist_id_fkey(
            id,
            slug,
            name,
            status
        )
    ),
    release_genres(
        genre:genres(
            id,
            slug,
            name
        )
    ),
    external_links(
        id,
        label,
        url,
        link_kind,
        provider,
        sort_order,
        is_primary
    )
`;

const ARTIST_SELECT = `
    id,
    slug,
    name,
    bio,
    status,
    published_at,
    sort_order,
    photo:media_assets!artists_photo_asset_id_fkey(
        id,
        media_kind,
        storage_bucket,
        storage_path,
        external_url,
        alt_text,
        width,
        height
    ),
    artist_role_assignments(
        sort_order,
        role:artist_roles!artist_role_assignments_role_slug_fkey(
            slug,
            name,
            sort_order
        )
    )
`;

function sortByOrder<T extends { sort_order: number }>(items: T[]) {
    return [...items].sort((a, b) => a.sort_order - b.sort_order);
}

function sortReleasesByDate<T extends { release_date: string }>(items: T[]) {
    return [...items].sort(
        (a, b) =>
            new Date(b.release_date).getTime() - new Date(a.release_date).getTime()
    );
}

export async function getPublishedReleaseRows(
    supabase: SupabaseClient
): Promise<SupabaseReleaseRow[]> {
    const { data, error } = await supabase
        .from('releases')
        .select(RELEASE_SELECT)
        .eq('status', 'published')
        .order('release_date', { ascending: false });

    if (error) {
        throw error;
    }

    return sortReleasesByDate((data ?? []) as unknown as SupabaseReleaseRow[]);
}

export async function getPublishedReleaseRowById(
    supabase: SupabaseClient,
    id: string
): Promise<SupabaseReleaseRow | null> {
    const { data, error } = await supabase
        .from('releases')
        .select(RELEASE_SELECT)
        .eq('status', 'published')
        .eq('id', id)
        .maybeSingle();

    if (error) {
        throw error;
    }

    return (data as unknown as SupabaseReleaseRow | null) ?? null;
}

export async function getPublishedReleaseRowsByIds(
    supabase: SupabaseClient,
    ids: string[]
): Promise<SupabaseReleaseRow[]> {
    if (ids.length === 0) {
        return [];
    }

    const { data, error } = await supabase
        .from('releases')
        .select(RELEASE_SELECT)
        .eq('status', 'published')
        .in('id', ids);

    if (error) {
        throw error;
    }

    return sortReleasesByDate((data ?? []) as unknown as SupabaseReleaseRow[]);
}

export async function getPublishedArtistRows(
    supabase: SupabaseClient
): Promise<SupabaseArtistRow[]> {
    const { data, error } = await supabase
        .from('artists')
        .select(ARTIST_SELECT)
        .eq('status', 'published')
        .order('sort_order', { ascending: true });

    if (error) {
        throw error;
    }

    return sortByOrder((data ?? []) as unknown as SupabaseArtistRow[]);
}

export async function getPublishedArtistRowById(
    supabase: SupabaseClient,
    id: string
): Promise<SupabaseArtistRow | null> {
    const { data, error } = await supabase
        .from('artists')
        .select(ARTIST_SELECT)
        .eq('status', 'published')
        .eq('id', id)
        .maybeSingle();

    if (error) {
        throw error;
    }

    return (data as unknown as SupabaseArtistRow | null) ?? null;
}

export async function getArtistReleaseContributionRows(
    supabase: SupabaseClient,
    artistId: string
): Promise<SupabaseArtistReleaseContributionRow[]> {
    const { data, error } = await supabase
        .from('release_contributors')
        .select('release_id, role_slug')
        .eq('artist_id', artistId);

    if (error) {
        throw error;
    }

    return (data ?? []) as SupabaseArtistReleaseContributionRow[];
}
