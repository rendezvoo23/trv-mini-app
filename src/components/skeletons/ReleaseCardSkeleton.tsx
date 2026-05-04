import { Skeleton } from '@/components/ui/skeleton';

export function ReleaseCardSkeleton() {
    return (
        <div className="border border-black bg-white p-2">
            <div className="grid grid-cols-[165px_minmax(0,1fr)] gap-4">
                <Skeleton className="aspect-square rounded-none bg-[#e8e8e8]" />
                <div className="flex flex-col justify-center space-y-2 pr-1">
                    <Skeleton className="h-4 w-12 rounded-none bg-[#e8e8e8]" />
                    <Skeleton className="h-6 w-28 rounded-none bg-[#e8e8e8]" />
                    <Skeleton className="h-5 w-24 rounded-none bg-[#e8e8e8]" />
                </div>
            </div>
            <div className="mt-6">
                <Skeleton className="h-[42px] w-full rounded-none bg-[#e8e8e8]" />
            </div>
        </div>
    );
}
