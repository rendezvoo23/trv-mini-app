import Image from 'next/image';
import Link from 'next/link';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';
import { listAdminReleases } from '@/lib/admin/repository';

export default async function AdminReleasesPage() {
    const releases = await listAdminReleases();

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Releases"
                description="Manage release content, covers, contributors, genres, and links."
                actionHref="/admin/releases/new"
                actionLabel="New release"
            />
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                            <th className="px-4 py-3">Release</th>
                            <th className="px-4 py-3">Type</th>
                            <th className="px-4 py-3">Release date</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Updated</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {releases.map((release) => (
                            <tr key={release.id} className="text-sm text-slate-700">
                                <td className="px-4 py-3">
                                    <Link
                                        href={`/admin/releases/${release.id}`}
                                        className="flex items-center gap-3 font-medium text-slate-900 hover:text-blue-600"
                                    >
                                        <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-slate-100">
                                            {release.cover ? (
                                                <Image
                                                    src={release.cover.url}
                                                    alt={release.cover.alt}
                                                    fill
                                                    sizes="48px"
                                                    className="object-cover"
                                                />
                                            ) : null}
                                        </div>
                                        <span>{release.title}</span>
                                    </Link>
                                </td>
                                <td className="px-4 py-3">{release.type}</td>
                                <td className="px-4 py-3 text-slate-500">
                                    {release.releaseDate}
                                </td>
                                <td className="px-4 py-3">
                                    <AdminStatusBadge status={release.status} />
                                </td>
                                <td className="px-4 py-3 text-slate-500">
                                    {release.updatedAt
                                        ? new Date(release.updatedAt).toLocaleString('ru-RU')
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
