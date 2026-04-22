import { notFound } from 'next/navigation';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { EventForm } from '@/components/admin/forms/EventForm';
import { getAdminEventFormData } from '@/lib/admin/repository';

export default async function EditAdminEventPage({
    params,
}: {
    params: { id: string };
}) {
    const event = await getAdminEventFormData(params.id);

    if (!event) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title={`Edit event: ${event.name}`}
                description="Update event details, poster, and links."
                backHref="/admin/events"
                backLabel="Back to events"
            />
            <EventForm initialData={event} />
        </div>
    );
}
