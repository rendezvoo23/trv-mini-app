import { Skeleton } from '@/components/ui/skeleton';

export function MemberCardSkeleton() {
    return (
        <div className="flex flex-col items-center">
            <Skeleton className="mb-3 h-36 w-36 rounded-full bg-[#dddddd]" />
            <Skeleton className="h-4 w-20 rounded-none bg-[#dddddd]" />
        </div>
    );
}
