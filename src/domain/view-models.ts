import {
    ArtistRoleKey,
    EventType,
    ExternalLinkKind,
    MerchAvailability,
    MerchCategory,
    ReleaseContributorRole,
    ReleaseType,
} from '@/domain/entities';

export type MemberFilterCategory =
    | 'All'
    | 'Artists'
    | 'Producers'
    | 'Designers'
    | 'DJs';
export type ReleaseSort = 'newest' | 'oldest';
export type MerchSort = 'newest' | 'artist' | 'available';

export interface MediaViewModel {
    id: string;
    url: string;
    alt: string;
}

export interface ExternalLinkViewModel {
    label: string;
    url: string;
    kind: ExternalLinkKind;
    provider: string | null;
}

export interface ArtistReferenceViewModel {
    id: string;
    slug: string;
    name: string;
}

export interface ArtistListItemViewModel extends ArtistReferenceViewModel {
    photo: MediaViewModel | null;
    roleKeys: ArtistRoleKey[];
    roleLabels: string[];
}

export interface ReleaseContributorViewModel {
    role: ReleaseContributorRole;
    roleLabel: string;
    artist: ArtistReferenceViewModel;
}

export interface ReleaseSummaryViewModel {
    id: string;
    slug: string;
    title: string;
    type: ReleaseType;
    typeLabel: string;
    cover: MediaViewModel | null;
    releaseDate: string;
    artistLine: string;
    isUpcoming: boolean;
    listenLink: ExternalLinkViewModel | null;
}

export interface ReleaseDetailViewModel extends ReleaseSummaryViewModel {
    description: string;
    genres: { id: string; slug: string; name: string }[];
    contributors: ReleaseContributorViewModel[];
    producerLine: string | null;
}

export interface MerchSummaryViewModel {
    id: string;
    slug: string;
    name: string;
    category: MerchCategory;
    categoryLabel: string;
    artist: ArtistReferenceViewModel | null;
    primaryImage: MediaViewModel | null;
    releaseDate: string;
    availability: MerchAvailability;
    isAvailable: boolean;
    purchaseLink: ExternalLinkViewModel | null;
}

export interface MerchDetailViewModel extends MerchSummaryViewModel {
    description: string;
    composition: string;
    gallery: MediaViewModel[];
}

export interface EventSummaryViewModel {
    id: string;
    slug: string;
    name: string;
    eventType: EventType;
    eventTypeLabel: string;
    poster: MediaViewModel | null;
    startsAt: string;
    venueName: string;
    city: string;
    ageRestriction: string;
    isUpcoming: boolean;
    ticketLink: ExternalLinkViewModel | null;
    infoLink: ExternalLinkViewModel | null;
}

export interface EventDetailViewModel extends EventSummaryViewModel {
    description: string;
    gallery: MediaViewModel[];
}

export interface ArtistDetailViewModel extends ArtistListItemViewModel {
    bio: string;
    artistReleases: ReleaseSummaryViewModel[];
    supportReleases: ReleaseSummaryViewModel[];
    merchItems: MerchSummaryViewModel[];
}
