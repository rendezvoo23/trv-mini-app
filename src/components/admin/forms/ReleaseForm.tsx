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
    saveReleaseAdminAction,
} from '@/lib/admin/actions';
import {
    ADMIN_RELEASE_CONTRIBUTOR_ROLE_OPTIONS,
    ADMIN_RELEASE_TYPE_OPTIONS,
    ADMIN_STATUS_OPTIONS,
} from '@/lib/admin/options';
import {
    AdminArtistOption,
    AdminOption,
    AdminReleaseFormData,
} from '@/lib/admin/types';

type ContributorRow = {
    artistId: string;
    roleSlug: string;
    creditOrder: number;
};

type LinkRow = {
    label: string;
    url: string;
    kind: 'listen' | 'purchase' | 'tickets' | 'info';
    provider: string | null;
    isPrimary: boolean;
    sortOrder: number;
};

function createEmptyContributorRow(index: number): ContributorRow {
    return {
        artistId: '',
        roleSlug: 'main',
        creditOrder: index + 1,
    };
}

function createEmptyLinkRow(index: number): LinkRow {
    return {
        label: '',
        url: '',
        kind: 'listen',
        provider: '',
        isPrimary: index === 0,
        sortOrder: index + 1,
    };
}

export function ReleaseForm({
    initialData,
    artistOptions,
    genreOptions,
}: {
    initialData: AdminReleaseFormData;
    artistOptions: AdminArtistOption[];
    genreOptions: AdminOption[];
}) {
    const [state, formAction] = useFormState(
        saveReleaseAdminAction,
        createEmptyAdminActionState()
    );
    const formState = state ?? createEmptyAdminActionState();
    const [contributors, setContributors] = useState<ContributorRow[]>(
        initialData.contributorRows.length > 0
            ? initialData.contributorRows
            : [createEmptyContributorRow(0)]
    );
    const [selectedGenreIds, setSelectedGenreIds] = useState<string[]>(
        initialData.genreIds
    );
    const [links, setLinks] = useState<LinkRow[]>(
        initialData.links.length > 0 ? initialData.links : [createEmptyLinkRow(0)]
    );

    function updateContributor(index: number, nextValue: Partial<ContributorRow>) {
        setContributors((current) =>
            current.map((row, rowIndex) =>
                rowIndex === index ? { ...row, ...nextValue } : row
            )
        );
    }

    function removeContributor(index: number) {
        setContributors((current) => current.filter((_, rowIndex) => rowIndex !== index));
    }

    function addContributor() {
        setContributors((current) => [
            ...current,
            createEmptyContributorRow(current.length),
        ]);
    }

    function toggleGenre(genreId: string) {
        setSelectedGenreIds((current) =>
            current.includes(genreId)
                ? current.filter((value) => value !== genreId)
                : [...current, genreId]
        );
    }

    function updateLink(index: number, nextValue: Partial<LinkRow>) {
        setLinks((current) =>
            current.map((row, rowIndex) =>
                rowIndex === index ? { ...row, ...nextValue } : row
            )
        );
    }

    function removeLink(index: number) {
        setLinks((current) => current.filter((_, rowIndex) => rowIndex !== index));
    }

    function addLink() {
        setLinks((current) => [...current, createEmptyLinkRow(current.length)]);
    }

    return (
        <form action={formAction} className="space-y-8">
            <input type="hidden" name="id" value={initialData.id ?? ''} />
            <input
                type="hidden"
                name="contributors_json"
                value={JSON.stringify(contributors)}
            />
            <input
                type="hidden"
                name="genre_ids_json"
                value={JSON.stringify(selectedGenreIds)}
            />
            <input type="hidden" name="links_json" value={JSON.stringify(links)} />
            <div className="grid gap-6 xl:grid-cols-[1.2fr_360px]">
                <div className="space-y-6">
                    <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="space-y-1">
                            <h2 className="text-lg font-semibold text-slate-950">
                                Main information
                            </h2>
                            <p className="text-sm text-slate-500">
                                Core release fields used on cards and detail pages.
                            </p>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <AutoSlugFields
                                sourceFieldId="release-title"
                                sourceFieldName="title"
                                sourceFieldLabel="Title"
                                sourceInitialValue={initialData.title}
                                sourceError={formState.fieldErrors?.title}
                                slugFieldId="release-slug"
                                slugFieldName="slug"
                                slugFieldLabel="Slug"
                                slugInitialValue={initialData.slug}
                                slugError={formState.fieldErrors?.slug}
                                isEditing={Boolean(initialData.id)}
                            />
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-900">
                                    Release type
                                </label>
                                <select
                                    name="release_type_slug"
                                    defaultValue={initialData.releaseTypeSlug}
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                                >
                                    {ADMIN_RELEASE_TYPE_OPTIONS.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                <FieldError
                                    message={formState.fieldErrors?.release_type_slug}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-900">
                                    Release date
                                </label>
                                <Input
                                    name="release_date"
                                    type="date"
                                    defaultValue={initialData.releaseDate}
                                />
                                <FieldError message={formState.fieldErrors?.release_date} />
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
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <h2 className="text-lg font-semibold text-slate-950">
                                    Contributors
                                </h2>
                                <p className="text-sm text-slate-500">
                                    Choose existing artists and assign roles with credit order.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={addContributor}
                                className="text-sm font-medium text-blue-600"
                            >
                                Add contributor
                            </button>
                        </div>
                        <div className="space-y-3">
                            {contributors.map((row, index) => (
                                <div
                                    key={`${row.artistId}-${index}`}
                                    className="grid gap-3 rounded-lg border border-slate-200 p-4 md:grid-cols-[1.4fr_1fr_110px_auto]"
                                >
                                    <select
                                        value={row.artistId}
                                        onChange={(event) =>
                                            updateContributor(index, {
                                                artistId: event.target.value,
                                            })
                                        }
                                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                                    >
                                        <option value="">Select artist</option>
                                        {artistOptions.map((artist) => (
                                            <option key={artist.id} value={artist.id}>
                                                {artist.name}
                                            </option>
                                        ))}
                                    </select>
                                    <select
                                        value={row.roleSlug}
                                        onChange={(event) =>
                                            updateContributor(index, {
                                                roleSlug: event.target.value,
                                            })
                                        }
                                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                                    >
                                        {ADMIN_RELEASE_CONTRIBUTOR_ROLE_OPTIONS.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    <Input
                                        type="number"
                                        value={row.creditOrder}
                                        onChange={(event) =>
                                            updateContributor(index, {
                                                creditOrder: Number(event.target.value) || 1,
                                            })
                                        }
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeContributor(index)}
                                        className="text-sm text-slate-500"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                        <FieldError message={formState.fieldErrors?.contributors} />
                    </section>

                    <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="space-y-1">
                            <h2 className="text-lg font-semibold text-slate-950">
                                Genres
                            </h2>
                            <p className="text-sm text-slate-500">
                                Assign one or more genres if the schema already supports them.
                            </p>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                            {genreOptions.map((genre) => (
                                <label
                                    key={genre.value}
                                    className="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-3 text-sm"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedGenreIds.includes(genre.value)}
                                        onChange={() => toggleGenre(genre.value)}
                                    />
                                    <span>{genre.label}</span>
                                </label>
                            ))}
                        </div>
                    </section>

                    <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <h2 className="text-lg font-semibold text-slate-950">
                                    External links
                                </h2>
                                <p className="text-sm text-slate-500">
                                    Add one or more links such as listen or info.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={addLink}
                                className="text-sm font-medium text-blue-600"
                            >
                                Add link
                            </button>
                        </div>
                        <div className="space-y-4">
                            {links.map((row, index) => (
                                <div
                                    key={`${row.kind}-${index}`}
                                    className="grid gap-3 rounded-lg border border-slate-200 p-4"
                                >
                                    <div className="grid gap-3 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-900">
                                                Link kind
                                            </label>
                                            <select
                                                value={row.kind}
                                                onChange={(event) =>
                                                    updateLink(index, {
                                                        kind: event.target.value as LinkRow['kind'],
                                                    })
                                                }
                                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                                            >
                                                <option value="listen">Listen</option>
                                                <option value="info">Info</option>
                                                <option value="tickets">Tickets</option>
                                                <option value="purchase">Purchase</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-900">
                                                Label
                                            </label>
                                            <Input
                                                value={row.label}
                                                onChange={(event) =>
                                                    updateLink(index, {
                                                        label: event.target.value,
                                                    })
                                                }
                                            />
                                            <FieldError
                                                message={
                                                    formState.fieldErrors?.[`links.${index}.label`]
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="grid gap-3 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-900">
                                                URL
                                            </label>
                                            <Input
                                                value={row.url}
                                                onChange={(event) =>
                                                    updateLink(index, {
                                                        url: event.target.value,
                                                    })
                                                }
                                            />
                                            <FieldError
                                                message={
                                                    formState.fieldErrors?.[`links.${index}.url`]
                                                }
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-900">
                                                Provider
                                            </label>
                                            <Input
                                                value={row.provider ?? ''}
                                                onChange={(event) =>
                                                    updateLink(index, {
                                                        provider: event.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <label className="flex items-center gap-2 text-sm text-slate-700">
                                            <input
                                                type="checkbox"
                                                checked={row.isPrimary}
                                                onChange={(event) =>
                                                    updateLink(index, {
                                                        isPrimary: event.target.checked,
                                                    })
                                                }
                                            />
                                            Primary link
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => removeLink(index)}
                                            className="text-sm text-slate-500"
                                        >
                                            Remove link
                                        </button>
                                    </div>
                                </div>
                            ))}
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
                            label="Release cover"
                            inputName="cover_asset_id"
                            bucket="releases"
                            altTextInputId="release-title"
                            folderHintInputId="release-slug"
                            altTextFallback={initialData.title}
                            folderHintFallback={initialData.slug || initialData.title}
                            initialAssetId={initialData.coverAssetId}
                            initialPreviewUrl={initialData.cover?.url}
                            initialPreviewAlt={initialData.cover?.alt}
                        />
                    </section>
                </div>
            </div>

            {formState.message ? (
                <p className="text-sm text-red-600">{formState.message}</p>
            ) : null}

            <div className="flex items-center justify-end gap-3">
                <SubmitButton>Save release</SubmitButton>
            </div>
        </form>
    );
}
