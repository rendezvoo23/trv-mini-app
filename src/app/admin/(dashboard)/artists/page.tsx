import Image from 'next/image';
import Link from 'next/link';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';
import { listAdminArtists } from '@/lib/admin/repository';

export default async function AdminArtistsPage() {
    const artists = await listAdminArtists();

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Artists"
                description="Manage artists and members shown in the public app."
                actionHref="/admin/artists/new"
                actionLabel="New artist"
            />
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                            <th className="px-4 py-3">Artist</th>
                            <th className="px-4 py-3">Slug</th>
                            <th className="px-4 py-3">Roles</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Updated</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {artists.map((artist) => (
                            <tr key={artist.id} className="text-sm text-slate-700">
                                <td className="px-4 py-3">
                                    <Link
                                        href={`/admin/artists/${artist.id}`}
                                        className="flex items-center gap-3 font-medium text-slate-900 hover:text-blue-600"
                                    >
                                        <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-slate-100">
                                            {artist.photo ? (
                                                <Image
                                                    src={artist.photo.url}
                                                    alt={artist.photo.alt}
                                                    fill
                                                    sizes="48px"
                                                    className="object-cover"
                                                />
                                            ) : null}
                                        </div>
                                        <span>{artist.name}</span>
                                    </Link>
                                </td>
                                <td className="px-4 py-3 text-slate-500">{artist.slug}</td>
                                <td className="px-4 py-3">{artist.roleLabels.join(', ')}</td>
                                <td className="px-4 py-3">
                                    <AdminStatusBadge status={artist.status} />
                                </td>
                                <td className="px-4 py-3 text-slate-500">
                                    {artist.updatedAt
                                        ? new Date(artist.updatedAt).toLocaleString('ru-RU')
                                        : '—'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
