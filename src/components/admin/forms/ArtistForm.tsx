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
    saveArtistAdminAction,
} from '@/lib/admin/actions';
import { ADMIN_STATUS_OPTIONS } from '@/lib/admin/options';
import { AdminArtistFormData, AdminOption } from '@/lib/admin/types';

export function ArtistForm({
    initialData,
    roleOptions,
}: {
    initialData: AdminArtistFormData;
    roleOptions: AdminOption[];
}) {
    const [state, formAction] = useFormState(
        saveArtistAdminAction,
        createEmptyAdminActionState()
    );
    const formState = state ?? createEmptyAdminActionState();
    const [selectedRoles, setSelectedRoles] = useState<string[]>(
        initialData.roleSlugs
    );

    function toggleRole(roleSlug: string) {
        setSelectedRoles((current) =>
            current.includes(roleSlug)
                ? current.filter((value) => value !== roleSlug)
                : [...current, roleSlug]
        );
    }

    return (
        <form action={formAction} className="space-y-8">
            <input type="hidden" name="id" value={initialData.id ?? ''} />
            <input
                type="hidden"
                name="role_slugs_json"
                value={JSON.stringify(selectedRoles)}
            />
            <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
                <div className="space-y-6">
                    <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="space-y-1">
                            <h2 className="text-lg font-semibold text-slate-950">
                                Main information
                            </h2>
                            <p className="text-sm text-slate-500">
                                Basic artist profile fields used in the public app.
                            </p>
                        </div>
                        <AutoSlugFields
                            sourceFieldId="artist-name"
                            sourceFieldName="name"
                            sourceFieldLabel="Name"
                            sourceInitialValue={initialData.name}
                            sourceError={formState.fieldErrors?.name}
                            slugFieldId="artist-slug"
                            slugFieldName="slug"
                            slugFieldLabel="Slug"
                            slugInitialValue={initialData.slug}
                            slugError={formState.fieldErrors?.slug}
                            isEditing={Boolean(initialData.id)}
                        />
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-900">
                                Bio
                            </label>
                            <Textarea
                                name="bio"
                                defaultValue={initialData.bio}
                                className="min-h-[180px]"
                            />
                            <FieldError message={formState.fieldErrors?.bio} />
                        </div>
                    </section>

                    <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="space-y-1">
                            <h2 className="text-lg font-semibold text-slate-950">
                                Roles
                            </h2>
                            <p className="text-sm text-slate-500">
                                An artist/member can have multiple roles at the same time.
                            </p>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                            {roleOptions.map((role) => (
                                <label
                                    key={role.value}
                                    className="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-3 text-sm"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedRoles.includes(role.value)}
                                        onChange={() => toggleRole(role.value)}
                                    />
                                    <span>{role.label}</span>
                                </label>
                            ))}
                        </div>
                        <FieldError message={formState.fieldErrors?.roles} />
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
                            label="Artist photo"
                            inputName="photo_asset_id"
                            bucket="artists"
                            altTextInputId="artist-name"
                            folderHintInputId="artist-slug"
                            altTextFallback={initialData.name}
                            folderHintFallback={initialData.slug || initialData.name}
                            initialAssetId={initialData.photoAssetId}
                            initialPreviewUrl={initialData.photo?.url}
                            initialPreviewAlt={initialData.photo?.alt}
                        />
                    </section>
                </div>
            </div>

            {formState.message ? (
                <p className="text-sm text-red-600">{formState.message}</p>
            ) : null}

            <div className="flex items-center justify-end gap-3">
                <SubmitButton>Save artist</SubmitButton>
            </div>
        </form>
    );
}
