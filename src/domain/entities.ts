import { PublishableFields, TimestampFields } from '@/domain/shared';

export type ArtistRoleKey =
    | 'artist'
    | 'producer'
    | 'designer'
    | 'dj'
    | 'beatmaker';
export type ReleaseType = 'single' | 'ep' | 'album' | 'mixtape';
export type ReleaseContributorRole =
    | 'main'
    | 'featured'
    | 'producer'
    | 'designer'
    | 'dj';
export type MerchCategory = 'hoodie' | 't-shirt' | 'vinyl' | 'cap';
export type MerchAvailability = 'available' | 'sold_out';
export type EventType =
    | 'concert'
    | 'club-night'
    | 'release-party'
    | 'listening-session';
export type ExternalLinkTargetType = 'release' | 'merch' | 'event';
export type ExternalLinkKind = 'listen' | 'purchase' | 'tickets' | 'info';
export type EntityMediaTargetType = 'artist' | 'release' | 'merch' | 'event';

export interface Genre extends TimestampFields {
    id: string;
    slug: string;
    name: string;
}

export interface MediaAsset extends TimestampFields {
    id: string;
    media_type: 'image';
    url: string;
    alt_text: string;
    width: number | null;
    height: number | null;
}

export interface Artist extends PublishableFields {
    id: string;
    slug: string;
    name: string;
    bio: string;
    photo_asset_id: string | null;
}

export interface Release extends PublishableFields {
    id: string;
    slug: string;
    title: string;
    release_type: ReleaseType;
    description: string;
    release_date: string;
    cover_asset_id: string | null;
}

export interface MerchItem extends PublishableFields {
    id: string;
    slug: string;
    primary_artist_id: string;
    name: string;
    merch_category: MerchCategory;
    description: string;
    composition: string;
    release_date: string;
    primary_media_asset_id: string | null;
    availability: MerchAvailability;
}

export interface Event extends PublishableFields {
    id: string;
    slug: string;
    name: string;
    event_type: EventType;
    description: string;
    poster_asset_id: string | null;
    starts_at: string;
    ends_at: string | null;
    timezone: string;
    venue_name: string;
    city: string;
    age_restriction: string;
}

export interface ExternalLink extends TimestampFields {
    id: string;
    target_type: ExternalLinkTargetType;
    target_id: string;
    link_kind: ExternalLinkKind;
    label: string;
    provider: string | null;
    url: string;
    sort_order: number;
}

export type AppUserStatus = 'active' | 'disabled';
export type UserRoleKey = 'admin' | 'editor';

export interface User extends TimestampFields {
    id: string;
    status: AppUserStatus;
    locale: string | null;
    last_seen_at: string | null;
}

export interface TelegramAccount extends TimestampFields {
    id: string;
    user_id: string;
    telegram_user_id: string;
    telegram_username: string | null;
    first_name: string;
    last_name: string | null;
    language_code: string | null;
    chat_id: string | null;
    is_bot_user: boolean;
    allows_bot_messages: boolean;
    last_seen_at: string | null;
    mini_app_last_seen_at: string | null;
    bot_last_seen_at: string | null;
}
