import { Skeleton } from '@/components/ui/skeleton';

export function MerchCardSkeleton() {
    return (
        <div>
            <Skeleton className="aspect-square rounded-xl mb-2" />
            <div className="space-y-1 px-0.5">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-14 rounded-full" />
            </div>
        </div>
    );
}
