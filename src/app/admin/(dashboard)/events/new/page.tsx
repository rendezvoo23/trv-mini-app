import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { EventForm } from '@/components/admin/forms/EventForm';

export default function NewAdminEventPage() {
    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="New event"
                description="Create a new event for the public app."
                backHref="/admin/events"
                backLabel="Back to events"
            />
            <EventForm
                initialData={{
                    id: null,
                    name: '',
                    slug: '',
                    description: '',
                    eventTypeSlug: 'concert',
                    startsAt: '',
                    endsAt: null,
                    venueName: '',
                    city: '',
                    ageRestriction: '18+',
                    status: 'draft',
                    sortOrder: 0,
                    posterAssetId: null,
                    poster: null,
                    ticketLabel: 'Buy Tickets',
                    ticketUrl: '',
                    infoLabel: 'Info',
                    infoUrl: '',
                    updatedAt: null,
                }}
            />
        </div>
    );
}
