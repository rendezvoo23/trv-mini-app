import { notFound } from 'next/navigation';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { ArtistForm } from '@/components/admin/forms/ArtistForm';
import {
    getAdminArtistFormData,
    listAdminArtistRoleOptions,
} from '@/lib/admin/repository';

export default async function EditAdminArtistPage({
    params,
}: {
    params: { id: string };
}) {
    const [artist, roleOptions] = await Promise.all([
        getAdminArtistFormData(params.id),
        listAdminArtistRoleOptions(),
    ]);

    if (!artist) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title={`Edit artist: ${artist.name}`}
                description="Update profile information, roles, status, and image."
                backHref="/admin/artists"
                backLabel="Back to artists"
            />
            <ArtistForm initialData={artist} roleOptions={roleOptions} />
        </div>
    );
}
