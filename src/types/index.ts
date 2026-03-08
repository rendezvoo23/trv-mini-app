// ===== Database-mirroring types (Supabase-ready) =====

export type ArtistRole = 'artist' | 'producer' | 'designer' | 'dj';
export type ReleaseType = 'single' | 'ep' | 'album' | 'mixtape';
export type ReleaseArtistRole = 'main' | 'feat' | 'producer' | 'designer';
export type MerchSort = 'newest' | 'artist' | 'available';
export type ReleaseSort = 'newest' | 'oldest';

export interface Genre {
    id: string;
    name: string;
}

export interface Artist {
    id: string;
    name: string;
    role: ArtistRole;
    photo_url: string;
    bio: string;
    created_at: string;
}

export interface Release {
    id: string;
    title: string;
    cover_url: string;
    type: ReleaseType;
    genre_id: string;
    description: string;
    release_date: string;
    listen_url: string;
    is_upcoming: boolean;
    created_at: string;
}

export interface ReleaseArtist {
    id: string;
    release_id: string;
    artist_id: string;
    role: ReleaseArtistRole;
}

export interface MerchItem {
    id: string;
    artist_id: string;
    name: string;
    type: string;
    image_urls: string[];
    description: string;
    composition: string;
    release_date: string;
    buy_url: string;
    available: boolean;
    created_at: string;
}

export interface Event {
    id: string;
    name: string;
    type: string;
    poster_url: string;
    description: string;
    photos: string[];
    date: string;
    age_restriction: string;
    ticket_url: string;
    is_upcoming: boolean;
    created_at: string;
}

// ===== Enriched types (joined/computed for UI) =====

export interface ReleaseWithArtists extends Release {
    artists: { artist: Artist; role: ReleaseArtistRole }[];
    genre: Genre;
}

export interface ArtistWithRelations extends Artist {
    releases: ReleaseWithArtists[];
    producedReleases: ReleaseWithArtists[];
    merch: MerchItem[];
}

export interface MerchItemWithArtist extends MerchItem {
    artist: Artist;
}

export type MemberFilterCategory = 'All' | 'Artists' | 'Producers' | 'Designers' | 'DJs';
