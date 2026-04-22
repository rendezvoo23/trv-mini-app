import {
    getEventTypeLabel,
    getReleaseContributorRoleLabel,
    getReleaseTypeLabel,
} from '@/domain/config';
import { EventType, ReleaseContributorRole, ReleaseType } from '@/domain/entities';

export const ADMIN_STATUS_OPTIONS = [
    { value: 'draft', label: 'Draft' },
    { value: 'published', label: 'Published' },
    { value: 'archived', label: 'Archived' },
] as const;

const RELEASE_TYPE_VALUES: ReleaseType[] = ['single', 'ep', 'album', 'mixtape'];
const EVENT_TYPE_VALUES: EventType[] = [
    'concert',
    'club-night',
    'release-party',
    'listening-session',
];
const CONTRIBUTOR_ROLE_VALUES: ReleaseContributorRole[] = [
    'main',
    'featured',
    'producer',
    'designer',
    'dj',
];

export const ADMIN_RELEASE_TYPE_OPTIONS = RELEASE_TYPE_VALUES.map((value) => ({
    value,
    label: getReleaseTypeLabel(value),
}));

export const ADMIN_EVENT_TYPE_OPTIONS = EVENT_TYPE_VALUES.map((value) => ({
    value,
    label: getEventTypeLabel(value),
}));

export const ADMIN_RELEASE_CONTRIBUTOR_ROLE_OPTIONS =
    CONTRIBUTOR_ROLE_VALUES.map((value) => ({
        value,
        label: getReleaseContributorRoleLabel(value),
    }));

export const FALLBACK_ARTIST_ROLE_OPTIONS = [
    { value: 'artist', label: 'Artist' },
    { value: 'producer', label: 'Producer' },
    { value: 'dj', label: 'DJ' },
    { value: 'designer', label: 'Designer' },
    { value: 'beatmaker', label: 'Beatmaker' },
];
