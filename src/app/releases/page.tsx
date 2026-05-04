'use client';

import { useReleases } from '@/lib/hooks/useReleases';
import { ReleaseGlassCard } from '@/components/cards/ReleaseGlassCard';
import { ReleaseCardSkeleton } from '@/components/skeletons/ReleaseCardSkeleton';
import Image from 'next/image';

export default function ReleasesPage() {
    const { data: releases, isLoading, isError } = useReleases('newest');

    return (
        <div
            className="min-h-screen bg-[#f4f4f1] px-6 pb-24 pt-6 text-black"
            style={{ fontFamily: 'Arial, sans-serif' }}
        >
            <header className="mb-10 flex items-center justify-center">
                <Image
                    src="/trv-logo.svg"
                    alt="TRV"
                    width={140}
                    height={40}
                    priority
                    className="h-auto w-[140px]"
                />
            </header>

            <section className="space-y-14">
                {isLoading ? (
                    Array.from({ length: 2 }).map((_, i) => (
                        <ReleaseCardSkeleton key={i} />
                    ))
                ) : isError ? (
                    <p className="border border-black px-4 py-3 text-sm text-black">
                        Unable to load releases right now.
                    </p>
                ) : (
                    releases?.map((release) => (
                        <ReleaseGlassCard key={release.id} release={release} />
                    ))
                )}
            </section>
        </div>
    );
}
