'use client';

import { useReleases } from '@/lib/hooks/useReleases';
import { ReleaseCard } from '@/components/cards/ReleaseCard';
import { ReleaseCardSkeleton } from '@/components/skeletons/ReleaseCardSkeleton';
import Image from 'next/image';

export default function ReleasesPage() {
    const { data: releases, isLoading } = useReleases('newest');

    return (
        <div className="space-y-6 pt-12">
            {/* Logo Section */}
            <div className="px-6 mb-6">
                <Image
                    src="/trv-logo.svg"
                    alt="TRV RELEASES"
                    width={140}
                    height={40}
                    priority
                    className="w-[180px] h-auto drop-shadow-md brightness-0 invert"
                />
            </div>

            {/* Releases List */}
            <section className="px-5 space-y-8">
                {isLoading
                    ? Array.from({ length: 2 }).map((_, i) => (
                        <ReleaseCardSkeleton key={i} />
                    ))
                    : releases?.map((release) => (
                        <ReleaseCard key={release.id} release={release} />
                    ))}
            </section>
        </div>
    );
}
