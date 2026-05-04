'use client';

import Image from 'next/image';
import { MemberCard } from '@/components/cards/MemberCard';
import { FilterTabs } from '@/components/FilterTabs';
import { MemberCardSkeleton } from '@/components/skeletons/MemberCardSkeleton';
import { MEMBER_FILTER_OPTIONS } from '@/domain/config';
import { useArtists } from '@/lib/hooks/useArtists';
import { useUIStore } from '@/store/uiStore';

export default function ArtistsPage() {
    const { memberFilter, setMemberFilter } = useUIStore();
    const { data: artists, isLoading, isError } = useArtists(memberFilter);

    return (
        <div
            className="min-h-screen bg-[#f4f4f1] pb-24 pt-6 text-black"
            style={{ fontFamily: 'Arial, sans-serif' }}
        >
            <header className="mb-8 flex items-center justify-center px-6">
                <Image
                    src="/trv-logo.svg"
                    alt="TRV"
                    width={140}
                    height={40}
                    priority
                    className="h-auto w-[140px]"
                />
            </header>

            <div className="mb-4">
                <FilterTabs
                    options={MEMBER_FILTER_OPTIONS}
                    activeOption={memberFilter}
                    onSelect={setMemberFilter}
                />
            </div>

            <section className="px-6">
                <div className="grid grid-cols-2 gap-x-6 gap-y-10">
                    {isLoading ? (
                        Array.from({ length: 6 }).map((_, i) => (
                            <MemberCardSkeleton key={i} />
                        ))
                    ) : isError ? (
                        <p className="col-span-2 border border-black px-4 py-3 text-sm text-black">
                            Unable to load members right now.
                        </p>
                    ) : (
                        artists?.map((artist) => (
                            <MemberCard key={artist.id} artist={artist} />
                        ))
                    )}
                </div>
            </section>
        </div>
    );
}
