'use client';

import { useReleases } from '@/lib/hooks/useReleases';
import { useUIStore } from '@/store/uiStore';
import { ReleaseCard } from '@/components/cards/ReleaseCard';
import { ReleaseCardSkeleton } from '@/components/skeletons/ReleaseCardSkeleton';
import { FilterTabs } from '@/components/FilterTabs';
import { ReleaseSort } from '@/types';

const sortOptions: ReleaseSort[] = ['newest', 'oldest'];

export default function ReleasesPage() {
    const { releaseSort, setReleaseSort } = useUIStore();
    const { data: releases, isLoading } = useReleases(releaseSort);

    const upcomingReleases = releases?.filter((r) => r.is_upcoming) || [];
    const publishedReleases = releases?.filter((r) => !r.is_upcoming) || [];

    return (
        <div className="space-y-6">
            {/* Sort Tabs */}
            <div className="pt-4">
                <FilterTabs
                    options={sortOptions}
                    activeOption={releaseSort}
                    onSelect={setReleaseSort}
                />
            </div>

            {/* Upcoming Section */}
            {upcomingReleases.length > 0 && (
                <section className="px-4 space-y-4">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-trv-blue">
                        Upcoming
                    </h2>
                    {upcomingReleases.map((release) => (
                        <ReleaseCard key={release.id} release={release} />
                    ))}
                </section>
            )}

            {/* Published Releases */}
            <section className="px-4 space-y-6">
                {!isLoading && upcomingReleases.length > 0 && (
                    <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        Released
                    </h2>
                )}

                {isLoading
                    ? Array.from({ length: 3 }).map((_, i) => (
                        <ReleaseCardSkeleton key={i} />
                    ))
                    : publishedReleases.map((release) => (
                        <ReleaseCard key={release.id} release={release} />
                    ))}
            </section>
        </div>
    );
}
