import {
    ArtistRoleKey,
    EntityMediaTargetType,
    ReleaseContributorRole,
    UserRoleKey,
} from '@/domain/entities';
import { TimestampFields } from '@/domain/shared';

export interface ArtistRoleAssignment extends TimestampFields {
    id: string;
    artist_id: string;
    role_key: ArtistRoleKey;
    sort_order: number;
}

export interface ReleaseContributor extends TimestampFields {
    id: string;
    release_id: string;
    artist_id: string;
    contributor_role: ReleaseContributorRole;
    credit_order: number;
}

export interface ReleaseGenreAssignment extends TimestampFields {
    id: string;
    release_id: string;
    genre_id: string;
}

export interface EntityMediaAssignment extends TimestampFields {
    id: string;
    target_type: EntityMediaTargetType;
    target_id: string;
    media_asset_id: string;
    media_role: 'gallery';
    sort_order: number;
}

export interface UserRoleAssignment extends TimestampFields {
    id: string;
    user_id: string;
    role_key: UserRoleKey;
}
