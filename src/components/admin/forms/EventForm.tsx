'use client';

import { useState } from 'react';
import { useFormState } from 'react-dom';
import { AdminImageUploadField } from '@/components/admin/AdminImageUploadField';
import { SubmitButton } from '@/components/admin/SubmitButton';
import { AutoSlugFields } from '@/components/admin/forms/AutoSlugFields';
import { FieldError } from '@/components/admin/forms/FieldError';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    createEmptyAdminActionState,
    saveEventAdminAction,
} from '@/lib/admin/actions';
import {
    ADMIN_EVENT_TYPE_OPTIONS,
    ADMIN_STATUS_OPTIONS,
} from '@/lib/admin/options';
import { AdminEventFormData } from '@/lib/admin/types';

function toDatetimeLocalValue(value: string | null) {
    if (!value) {
        return '';
    }

    const date = new Date(value);
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    const hours = `${date.getHours()}`.padStart(2, '0');
    const minutes = `${date.getMinutes()}`.padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function EventForm({ initialData }: { initialData: AdminEventFormData }) {
    const [state, formAction] = useFormState(
        saveEventAdminAction,
        createEmptyAdminActionState()
    );
    const formState = state ?? createEmptyAdminActionState();
    const [startsAtLocal, setStartsAtLocal] = useState(
        toDatetimeLocalValue(initialData.startsAt)
    );
    const [endsAtLocal, setEndsAtLocal] = useState(
        toDatetimeLocalValue(initialData.endsAt)
    );

    const startsAtIso = startsAtLocal
        ? new Date(startsAtLocal).toISOString()
        : '';
    const endsAtIso = endsAtLocal ? new Date(endsAtLocal).toISOString() : '';

    return (
        <form action={formAction} className="space-y-8">
            <input type="hidden" name="id" value={initialData.id ?? ''} />
            <input type="hidden" name="starts_at" value={startsAtIso} />
            <input type="hidden" name="ends_at" value={endsAtIso} />
            <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
                <div className="space-y-6">
                    <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="space-y-1">
                            <h2 className="text-lg font-semibold text-slate-950">
                                Main information
                            </h2>
                            <p className="text-sm text-slate-500">
                                Event fields used by the public app.
                            </p>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <AutoSlugFields
                                sourceFieldId="event-name"
                                sourceFieldName="name"
                                sourceFieldLabel="Name"
                                sourceInitialValue={initialData.name}
                                sourceError={formState.fieldErrors?.name}
                                slugFieldId="event-slug"
                                slugFieldName="slug"
                                slugFieldLabel="Slug"
                                slugInitialValue={initialData.slug}
                                slugError={formState.fieldErrors?.slug}
                                isEditing={Boolean(initialData.id)}
                            />
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-900">
                                    Event type
                                </label>
                                <select
                                    name="event_type_slug"
                                    defaultValue={initialData.eventTypeSlug}
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                                >
                                    {ADMIN_EVENT_TYPE_OPTIONS.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-900">
                                    Age restriction
                                </label>
                                <Input
                                    name="age_restriction"
                                    defaultValue={initialData.ageRestriction}
                                />
                                <FieldError message={formState.fieldErrors?.age_restriction} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-900">
                                    Starts at
                                </label>
                                <Input
                                    type="datetime-local"
                                    value={startsAtLocal}
                                    onChange={(event) => setStartsAtLocal(event.target.value)}
                                />
                                <FieldError message={formState.fieldErrors?.starts_at} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-900">
                                    Ends at
                                </label>
                                <Input
                                    type="datetime-local"
                                    value={endsAtLocal}
                                    onChange={(event) => setEndsAtLocal(event.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-900">
                                    Venue
                                </label>
                                <Input
                                    name="venue_name"
                                    defaultValue={initialData.venueName}
                                />
                                <FieldError message={formState.fieldErrors?.venue_name} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-900">
                                    City
                                </label>
                                <Input name="city" defaultValue={initialData.city} />
                                <FieldError message={formState.fieldErrors?.city} />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium text-slate-900">
                                    Description
                                </label>
                                <Textarea
                                    name="description"
                                    defaultValue={initialData.description}
                                />
                                <FieldError message={formState.fieldErrors?.description} />
                            </div>
                        </div>
                    </section>

                    <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="space-y-1">
                            <h2 className="text-lg font-semibold text-slate-950">
                                External links
                            </h2>
                            <p className="text-sm text-slate-500">
                                Keep v1 simple with optional ticket and info links.
                            </p>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-900">
                                    Ticket button label
                                </label>
                                <Input
                                    name="ticket_label"
                                    defaultValue={initialData.ticketLabel}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-900">
                                    Ticket URL
                                </label>
                                <Input
                                    name="ticket_url"
                                    defaultValue={initialData.ticketUrl}
                                />
                                <FieldError message={formState.fieldErrors?.ticket_url} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-900">
                                    Info button label
                                </label>
                                <Input
                                    name="info_label"
                                    defaultValue={initialData.infoLabel}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-900">
                                    Info URL
                                </label>
                                <Input
                                    name="info_url"
                                    defaultValue={initialData.infoUrl}
                                />
                                <FieldError message={formState.fieldErrors?.info_url} />
                            </div>
                        </div>
                    </section>
                </div>

                <div className="space-y-6">
                    <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-slate-950">Publishing</h2>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-900">
                                Status
                            </label>
                            <select
                                name="status"
                                defaultValue={initialData.status}
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                            >
                                {ADMIN_STATUS_OPTIONS.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-900">
                                Sort order
                            </label>
                            <Input
                                name="sort_order"
                                type="number"
                                defaultValue={initialData.sortOrder}
                            />
                        </div>
                        {initialData.updatedAt ? (
                            <p className="text-xs text-slate-500">
                                Last updated:{' '}
                                {new Date(initialData.updatedAt).toLocaleString('ru-RU')}
                            </p>
                        ) : null}
                    </section>

                    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <AdminImageUploadField
                            label="Event poster"
                            inputName="poster_asset_id"
                            bucket="events"
                            altTextInputId="event-name"
                            folderHintInputId="event-slug"
                            altTextFallback={initialData.name}
                            folderHintFallback={initialData.slug || initialData.name}
                            initialAssetId={initialData.posterAssetId}
                            initialPreviewUrl={initialData.poster?.url}
                            initialPreviewAlt={initialData.poster?.alt}
                        />
                    </section>
                </div>
            </div>

            {formState.message ? (
                <p className="text-sm text-red-600">{formState.message}</p>
            ) : null}

            <div className="flex items-center justify-end gap-3">
                <SubmitButton>Save event</SubmitButton>
            </div>
        </form>
    );
}
