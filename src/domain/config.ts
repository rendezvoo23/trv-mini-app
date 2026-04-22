import {
    ArtistRoleKey,
    EventType,
    MerchCategory,
    ReleaseContributorRole,
    ReleaseType,
} from '@/domain/entities';
import {
    MemberFilterCategory,
    MerchSort,
    ReleaseSort,
} from '@/domain/view-models';

export const MEMBER_FILTER_OPTIONS: MemberFilterCategory[] = [
    'All',
    'Artists',
    'Producers',
    'Designers',
    'DJs',
];

export const MERCH_SORT_OPTIONS: MerchSort[] = [
    'newest',
    'artist',
    'available',
];

export const RELEASE_SORT_OPTIONS: ReleaseSort[] = ['newest', 'oldest'];

export const ARTIST_ROLE_LABELS: Record<ArtistRoleKey, string> = {
    artist: 'Artist',
    producer: 'Producer',
    designer: 'Designer',
    dj: 'DJ',
    beatmaker: 'Beatmaker',
};

export const RELEASE_TYPE_LABELS: Record<ReleaseType, string> = {
    single: 'Single',
    ep: 'EP',
    album: 'Album',
    mixtape: 'Mixtape',
};

export const RELEASE_CONTRIBUTOR_ROLE_LABELS: Record<
    ReleaseContributorRole,
    string
> = {
    main: 'Main artist',
    featured: 'Featured artist',
    producer: 'Producer',
    designer: 'Designer',
    dj: 'DJ',
};

export const MERCH_CATEGORY_LABELS: Record<MerchCategory, string> = {
    hoodie: 'Hoodie',
    't-shirt': 'T-Shirt',
    vinyl: 'Vinyl',
    cap: 'Cap',
};

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
    concert: 'Concert',
    'club-night': 'Club Night',
    'release-party': 'Release Party',
    'listening-session': 'Listening Session',
};

const FILTER_ROLE_MAP: Record<
    Exclude<MemberFilterCategory, 'All'>,
    ArtistRoleKey
> = {
    Artists: 'artist',
    Producers: 'producer',
    Designers: 'designer',
    DJs: 'dj',
};

export function getArtistRoleLabel(role: ArtistRoleKey) {
    return ARTIST_ROLE_LABELS[role];
}

export function getReleaseTypeLabel(type: ReleaseType) {
    return RELEASE_TYPE_LABELS[type];
}

export function getReleaseContributorRoleLabel(role: ReleaseContributorRole) {
    return RELEASE_CONTRIBUTOR_ROLE_LABELS[role];
}

export function getMerchCategoryLabel(category: MerchCategory) {
    return MERCH_CATEGORY_LABELS[category];
}

export function getEventTypeLabel(type: EventType) {
    return EVENT_TYPE_LABELS[type];
}

export function matchesMemberFilter(
    roleKeys: ArtistRoleKey[],
    filter: MemberFilterCategory
) {
    if (filter === 'All') {
        return true;
    }

    return roleKeys.includes(FILTER_ROLE_MAP[filter]);
}
