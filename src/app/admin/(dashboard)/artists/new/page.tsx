import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { ArtistForm } from '@/components/admin/forms/ArtistForm';
import { listAdminArtistRoleOptions } from '@/lib/admin/repository';

export default async function NewAdminArtistPage() {
    const roleOptions = await listAdminArtistRoleOptions();

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="New artist"
                description="Create a new artist or member profile."
                backHref="/admin/artists"
                backLabel="Back to artists"
            />
            <ArtistForm
                roleOptions={roleOptions}
                initialData={{
                    id: null,
                    name: '',
                    slug: '',
                    bio: '',
                    status: 'draft',
                    sortOrder: 0,
                    roleSlugs: [],
                    photoAssetId: null,
                    photo: null,
                    updatedAt: null,
                }}
            />
        </div>
    );
}
