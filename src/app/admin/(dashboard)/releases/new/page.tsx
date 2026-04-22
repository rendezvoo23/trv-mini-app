import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { ReleaseForm } from '@/components/admin/forms/ReleaseForm';
import {
    listAdminArtistOptions,
    listAdminGenreOptions,
} from '@/lib/admin/repository';

export default async function NewAdminReleasePage() {
    const [artistOptions, genreOptions] = await Promise.all([
        listAdminArtistOptions(),
        listAdminGenreOptions(),
    ]);

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="New release"
                description="Create a release with contributors, genres, cover, and links."
                backHref="/admin/releases"
                backLabel="Back to releases"
            />
            <ReleaseForm
                artistOptions={artistOptions}
                genreOptions={genreOptions}
                initialData={{
                    id: null,
                    title: '',
                    slug: '',
                    description: '',
                    releaseTypeSlug: 'single',
                    releaseDate: '',
                    status: 'draft',
                    sortOrder: 0,
                    coverAssetId: null,
                    cover: null,
                    contributorRows: [],
                    genreIds: [],
                    links: [],
                    updatedAt: null,
                }}
            />
        </div>
    );
}
