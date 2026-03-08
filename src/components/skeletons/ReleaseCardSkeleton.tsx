import { Skeleton } from '@/components/ui/skeleton';

export function ReleaseCardSkeleton() {
    return (
        <div>
            <Skeleton className="aspect-square rounded-xl mb-3" />
            <div className="space-y-2 px-1">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-5 w-40" />
                <div className="flex items-center justify-between pt-1">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-8 w-20 rounded-full" />
                </div>
            </div>
        </div>
    );
}
