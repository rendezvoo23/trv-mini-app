export type SupabaseMaybeMany<T> = T | T[] | null;

export interface SupabaseLookupRow {
    slug: string;
    name: string;
    sort_order?: number | null;
}

export interface SupabaseMediaAssetRow {
    id: string;
    media_kind: string;
    storage_bucket: string | null;
    storage_path: string | null;
    external_url: string | null;
    alt_text: string | null;
    width: number | null;
    height: number | null;
}

export interface SupabaseExternalLinkRow {
    id: string;
    label: string;
    url: string;
    link_kind: 'listen' | 'purchase' | 'tickets' | 'info';
    provider: string | null;
    sort_order: number;
    is_primary: boolean;
}

export interface SupabaseArtistReferenceRow {
    id: string;
    slug: string;
    name: string;
    status: 'draft' | 'published' | 'archived';
}

export interface SupabaseArtistRoleAssignmentRow {
    sort_order: number;
    role: SupabaseMaybeMany<SupabaseLookupRow>;
}

export interface SupabaseArtistRow {
    id: string;
    slug: string;
    name: string;
    bio: string;
    status: 'draft' | 'published' | 'archived';
    published_at: string | null;
    sort_order: number;
    photo: SupabaseMaybeMany<SupabaseMediaAssetRow>;
    artist_role_assignments: SupabaseArtistRoleAssignmentRow[] | null;
}

export interface SupabaseReleaseContributorRow {
    credit_order: number;
    role: SupabaseMaybeMany<SupabaseLookupRow>;
    artist: SupabaseMaybeMany<SupabaseArtistReferenceRow>;
}

export interface SupabaseReleaseGenreRow {
    genre: {
        id: string;
        slug: string;
        name: string;
    } | null;
}

export interface SupabaseReleaseRow {
    id: string;
    slug: string;
    title: string;
    description: string;
    release_date: string;
    status: 'draft' | 'published' | 'archived';
    published_at: string | null;
    sort_order: number;
    release_type: SupabaseMaybeMany<SupabaseLookupRow>;
    cover: SupabaseMaybeMany<SupabaseMediaAssetRow>;
    release_contributors: SupabaseReleaseContributorRow[] | null;
    release_genres: SupabaseReleaseGenreRow[] | null;
    external_links: SupabaseExternalLinkRow[] | null;
}

export interface SupabaseArtistReleaseContributionRow {
    release_id: string;
    role_slug: string;
}
