import Image from 'next/image';
import Link from 'next/link';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';
import { listAdminEvents } from '@/lib/admin/repository';

export default async function AdminEventsPage() {
    const events = await listAdminEvents();

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Events"
                description="Manage event schedule, poster, and outbound links."
                actionHref="/admin/events/new"
                actionLabel="New event"
            />
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                            <th className="px-4 py-3">Event</th>
                            <th className="px-4 py-3">Date</th>
                            <th className="px-4 py-3">City / venue</th>
                            <th className="px-4 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {events.map((event) => (
                            <tr key={event.id} className="text-sm text-slate-700">
                                <td className="px-4 py-3">
                                    <Link
                                        href={`/admin/events/${event.id}`}
                                        className="flex items-center gap-3 font-medium text-slate-900 hover:text-blue-600"
                                    >
                                        <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-slate-100">
                                            {event.poster ? (
                                                <Image
                                                    src={event.poster.url}
                                                    alt={event.poster.alt}
                                                    fill
                                                    sizes="48px"
                                                    className="object-cover"
                                                />
                                            ) : null}
                                        </div>
                                        <span>{event.name}</span>
                                    </Link>
                                </td>
                                <td className="px-4 py-3 text-slate-500">
                                    {event.startsAt
                                        ? new Date(event.startsAt).toLocaleString('ru-RU')
                                        : '—'}
                                </td>
                                <td className="px-4 py-3 text-slate-500">
                                    {[event.city, event.venueName].filter(Boolean).join(' / ')}
                                </td>
                                <td className="px-4 py-3">
                                    <AdminStatusBadge status={event.status} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
