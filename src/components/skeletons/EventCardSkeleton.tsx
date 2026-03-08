import { Skeleton } from '@/components/ui/skeleton';

export function EventCardSkeleton() {
    return (
        <div>
            <Skeleton className="aspect-[3/4] rounded-xl mb-3" />
        </div>
    );
}
