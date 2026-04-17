export type PublicationStatus = 'draft' | 'published' | 'archived';

export interface TimestampFields {
    created_at: string;
    updated_at: string;
}

export interface PublishableFields extends TimestampFields {
    status: PublicationStatus;
    published_at: string | null;
    sort_order: number;
}
