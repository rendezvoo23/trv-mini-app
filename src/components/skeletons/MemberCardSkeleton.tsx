import { Skeleton } from '@/components/ui/skeleton';

export function MemberCardSkeleton() {
    return (
        <div className="flex flex-col items-center">
            <Skeleton className="w-28 h-28 rounded-full mb-3" />
            <Skeleton className="h-3 w-20 mb-1" />
            <Skeleton className="h-4 w-14 rounded-full" />
        </div>
    );
}
