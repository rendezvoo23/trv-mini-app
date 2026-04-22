'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {
    AdminActionState,
    createEmptyAdminActionState,
    requireAdminUser,
} from '@/lib/admin/auth';
import {
    saveAdminArtist,
    saveAdminEvent,
    saveAdminRelease,
} from '@/lib/admin/repository';
import { createClient as createServerSupabaseClient } from '@/lib/supabase/server';
import {
    getNumberValue,
    getOptionalString,
    getRequiredString,
    isValidUrl,
    parseJsonField,
} from '@/lib/admin/validation';

function invalidState(
    message: string,
    fieldErrors?: Record<string, string>
): AdminActionState {
    return {
        success: false,
        message,
        fieldErrors,
    };
}

export async function loginAdminAction(
    _prevState: AdminActionState,
    formData: FormData
): Promise<AdminActionState> {
    const email = getOptionalString(formData.get('email'));
    const password = getOptionalString(formData.get('password'));

    if (!email || !password) {
        return invalidState('Enter email and password.');
    }

    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        return invalidState('Unable to sign in. Check your email and password.');
    }

    redirect('/admin');
}

export async function logoutAdminAction() {
    const supabase = await createServerSupabaseClient();
    await supabase.auth.signOut();
    redirect('/admin/login');
}

export async function saveArtistAdminAction(
    _prevState: AdminActionState,
    formData: FormData
): Promise<AdminActionState> {
    await requireAdminUser();

    const fieldErrors: Record<string, string> = {};
    const id = getOptionalString(formData.get('id'));
    const name = getRequiredString(formData.get('name'), 'name', fieldErrors);
    const slug = getRequiredString(formData.get('slug'), 'slug', fieldErrors);
    const bio = getRequiredString(formData.get('bio'), 'bio', fieldErrors);
    const status =
        (getOptionalString(formData.get('status')) as
            | 'draft'
            | 'published'
            | 'archived'
            | null) ?? 'draft';
    const sortOrder = getNumberValue(formData.get('sort_order'));
    const photoAssetId = getOptionalString(formData.get('photo_asset_id'));
    const roleSlugs = parseJsonField<string[]>(
        formData.get('role_slugs_json'),
        []
    ).filter(Boolean);

    if (status === 'published' && roleSlugs.length === 0) {
        fieldErrors.roles = 'Add at least one role before publishing.';
    }

    if (Object.keys(fieldErrors).length > 0) {
        return invalidState('Please fix the highlighted fields.', fieldErrors);
    }

    let artistId: string;
    try {
        artistId = await saveAdminArtist({
            id,
            name,
            slug,
            bio,
            status,
            sortOrder,
            roleSlugs,
            photoAssetId,
        });
    } catch (error) {
        return invalidState(
            error instanceof Error ? error.message : 'Unable to save artist.'
        );
    }

    revalidatePath('/admin/artists');
    revalidatePath('/artists');
    revalidatePath(`/artists/${artistId}`);
    redirect('/admin/artists');
}

export async function saveReleaseAdminAction(
    _prevState: AdminActionState,
    formData: FormData
): Promise<AdminActionState> {
    await requireAdminUser();

    const fieldErrors: Record<string, string> = {};
    const id = getOptionalString(formData.get('id'));
    const title = getRequiredString(formData.get('title'), 'title', fieldErrors);
    const slug = getRequiredString(formData.get('slug'), 'slug', fieldErrors);
    const description = getRequiredString(
        formData.get('description'),
        'description',
        fieldErrors
    );
    const releaseTypeSlug = getRequiredString(
        formData.get('release_type_slug'),
        'release_type_slug',
        fieldErrors
    );
    const releaseDate = getRequiredString(
        formData.get('release_date'),
        'release_date',
        fieldErrors
    );
    const status =
        (getOptionalString(formData.get('status')) as
            | 'draft'
            | 'published'
            | 'archived'
            | null) ?? 'draft';
    const sortOrder = getNumberValue(formData.get('sort_order'));
    const coverAssetId = getOptionalString(formData.get('cover_asset_id'));
    const contributorRows = parseJsonField<
        Array<{ artistId: string; roleSlug: string; creditOrder: number }>
    >(formData.get('contributors_json'), []).filter(
        (row) => row.artistId && row.roleSlug
    );
    const genreIds = parseJsonField<string[]>(
        formData.get('genre_ids_json'),
        []
    ).filter(Boolean);
    const links = parseJsonField<
        Array<{
            label: string;
            url: string;
            kind: 'listen' | 'purchase' | 'tickets' | 'info';
            provider: string | null;
            isPrimary: boolean;
            sortOrder: number;
        }>
    >(formData.get('links_json'), []).filter((link) => link.label || link.url);

    if (status === 'published' && contributorRows.length === 0) {
        fieldErrors.contributors = 'Add at least one contributor before publishing.';
    }

    links.forEach((link, index) => {
        if (!link.label) {
            fieldErrors[`links.${index}.label`] = 'Link label is required.';
        }
        if (!link.url) {
            fieldErrors[`links.${index}.url`] = 'Link URL is required.';
        } else if (!isValidUrl(link.url)) {
            fieldErrors[`links.${index}.url`] = 'Enter a valid URL.';
        }
    });

    if (Object.keys(fieldErrors).length > 0) {
        return invalidState('Please fix the highlighted fields.', fieldErrors);
    }

    let releaseId: string;
    try {
        releaseId = await saveAdminRelease({
            id,
            title,
            slug,
            description,
            releaseTypeSlug,
            releaseDate,
            status,
            sortOrder,
            coverAssetId,
            contributorRows,
            genreIds,
            links,
        });
    } catch (error) {
        return invalidState(
            error instanceof Error ? error.message : 'Unable to save release.'
        );
    }

    revalidatePath('/admin/releases');
    revalidatePath('/releases');
    revalidatePath(`/releases/${releaseId}`);
    redirect('/admin/releases');
}

export async function saveEventAdminAction(
    _prevState: AdminActionState,
    formData: FormData
): Promise<AdminActionState> {
    await requireAdminUser();

    const fieldErrors: Record<string, string> = {};
    const id = getOptionalString(formData.get('id'));
    const name = getRequiredString(formData.get('name'), 'name', fieldErrors);
    const slug = getRequiredString(formData.get('slug'), 'slug', fieldErrors);
    const description = getRequiredString(
        formData.get('description'),
        'description',
        fieldErrors
    );
    const eventTypeSlug = getRequiredString(
        formData.get('event_type_slug'),
        'event_type_slug',
        fieldErrors
    );
    const startsAt = getRequiredString(
        formData.get('starts_at'),
        'starts_at',
        fieldErrors
    );
    const endsAt = getOptionalString(formData.get('ends_at'));
    const venueName = getRequiredString(
        formData.get('venue_name'),
        'venue_name',
        fieldErrors
    );
    const city = getRequiredString(formData.get('city'), 'city', fieldErrors);
    const ageRestriction = getRequiredString(
        formData.get('age_restriction'),
        'age_restriction',
        fieldErrors
    );
    const status =
        (getOptionalString(formData.get('status')) as
            | 'draft'
            | 'published'
            | 'archived'
            | null) ?? 'draft';
    const sortOrder = getNumberValue(formData.get('sort_order'));
    const posterAssetId = getOptionalString(formData.get('poster_asset_id'));
    const ticketLabel = getOptionalString(formData.get('ticket_label')) ?? 'Buy Tickets';
    const ticketUrl = getOptionalString(formData.get('ticket_url')) ?? '';
    const infoLabel = getOptionalString(formData.get('info_label')) ?? 'Info';
    const infoUrl = getOptionalString(formData.get('info_url')) ?? '';

    if (ticketUrl && !isValidUrl(ticketUrl)) {
        fieldErrors.ticket_url = 'Enter a valid URL.';
    }

    if (infoUrl && !isValidUrl(infoUrl)) {
        fieldErrors.info_url = 'Enter a valid URL.';
    }

    if (Object.keys(fieldErrors).length > 0) {
        return invalidState('Please fix the highlighted fields.', fieldErrors);
    }

    let eventId: string;
    try {
        eventId = await saveAdminEvent({
            id,
            name,
            slug,
            description,
            eventTypeSlug,
            startsAt,
            endsAt,
            venueName,
            city,
            ageRestriction,
            status,
            sortOrder,
            posterAssetId,
            ticketLabel,
            ticketUrl,
            infoLabel,
            infoUrl,
        });
    } catch (error) {
        return invalidState(
            error instanceof Error ? error.message : 'Unable to save event.'
        );
    }

    revalidatePath('/admin/events');
    revalidatePath('/events');
    revalidatePath(`/events/${eventId}`);
    redirect('/admin/events');
}

export { createEmptyAdminActionState };
