import { notFound } from 'next/navigation';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { ReleaseForm } from '@/components/admin/forms/ReleaseForm';
import {
    getAdminReleaseFormData,
    listAdminArtistOptions,
    listAdminGenreOptions,
} from '@/lib/admin/repository';

export default async function EditAdminReleasePage({
    params,
}: {
    params: { id: string };
}) {
    const [release, artistOptions, genreOptions] = await Promise.all([
        getAdminReleaseFormData(params.id),
        listAdminArtistOptions(),
        listAdminGenreOptions(),
    ]);

    if (!release) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title={`Edit release: ${release.title}`}
                description="Update release metadata, cover, contributors, genres, and links."
                backHref="/admin/releases"
                backLabel="Back to releases"
            />
            <ReleaseForm
                initialData={release}
                artistOptions={artistOptions}
                genreOptions={genreOptions}
            />
        </div>
    );
}
