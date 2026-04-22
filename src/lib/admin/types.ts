export interface AdminAssetPreview {
    id: string;
    url: string;
    alt: string;
}

export interface AdminOption {
    value: string;
    label: string;
}

export interface AdminArtistListItem {
    id: string;
    name: string;
    slug: string;
    status: 'draft' | 'published' | 'archived';
    roleLabels: string[];
    photo: AdminAssetPreview | null;
    updatedAt: string | null;
}

export interface AdminArtistFormData {
    id: string | null;
    name: string;
    slug: string;
    bio: string;
    status: 'draft' | 'published' | 'archived';
    sortOrder: number;
    roleSlugs: string[];
    photoAssetId: string | null;
    photo: AdminAssetPreview | null;
    updatedAt: string | null;
}

export interface AdminArtistOption {
    id: string;
    name: string;
    slug: string;
}

export interface AdminReleaseContributorInput {
    artistId: string;
    roleSlug: string;
    creditOrder: number;
}

export interface AdminExternalLinkInput {
    label: string;
    url: string;
    kind: 'listen' | 'purchase' | 'tickets' | 'info';
    provider: string | null;
    isPrimary: boolean;
    sortOrder: number;
}

export interface AdminReleaseListItem {
    id: string;
    title: string;
    slug: string;
    type: string;
    releaseDate: string;
    status: 'draft' | 'published' | 'archived';
    cover: AdminAssetPreview | null;
    updatedAt: string | null;
}

export interface AdminReleaseFormData {
    id: string | null;
    title: string;
    slug: string;
    description: string;
    releaseTypeSlug: string;
    releaseDate: string;
    status: 'draft' | 'published' | 'archived';
    sortOrder: number;
    coverAssetId: string | null;
    cover: AdminAssetPreview | null;
    contributorRows: AdminReleaseContributorInput[];
    genreIds: string[];
    links: AdminExternalLinkInput[];
    updatedAt: string | null;
}

export interface AdminEventListItem {
    id: string;
    name: string;
    slug: string;
    startsAt: string;
    city: string;
    venueName: string;
    status: 'draft' | 'published' | 'archived';
    poster: AdminAssetPreview | null;
    updatedAt: string | null;
}

export interface AdminEventFormData {
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
    poster: AdminAssetPreview | null;
    ticketLabel: string;
    ticketUrl: string;
    infoLabel: string;
    infoUrl: string;
    updatedAt: string | null;
}
