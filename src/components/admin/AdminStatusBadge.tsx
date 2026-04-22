import { Badge } from '@/components/ui/badge';

export function AdminStatusBadge({
    status,
}: {
    status: 'draft' | 'published' | 'archived';
}) {
    const className =
        status === 'published'
            ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
            : status === 'archived'
              ? 'bg-slate-200 text-slate-700 border-slate-300'
              : 'bg-amber-100 text-amber-700 border-amber-200';

    return (
        <Badge variant="outline" className={className}>
            {status}
        </Badge>
    );
}
