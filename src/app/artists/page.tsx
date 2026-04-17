'use client';

import { useArtists } from '@/lib/hooks/useArtists';
import { useUIStore } from '@/store/uiStore';
import { MemberCard } from '@/components/cards/MemberCard';
import { MemberCardSkeleton } from '@/components/skeletons/MemberCardSkeleton';
import { FilterTabs } from '@/components/FilterTabs';
import { ArtistRole, MemberFilterCategory } from '@/types';

import Image from 'next/image';

const filterOptions: MemberFilterCategory[] = [
    'All',
    'Artists',
    'Producers',
    'Designers',
    'DJs',
];

const filterToRole: Record<MemberFilterCategory, ArtistRole | undefined> = {
    All: undefined,
    Artists: 'artist',
    Producers: 'producer',
    Designers: 'designer',
    DJs: 'dj',
};

export default function ArtistsPage() {
    const { memberFilter, setMemberFilter } = useUIStore();
    const role = filterToRole[memberFilter];
    const { data: artists, isLoading } = useArtists(role);

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="px-5 pt-12 pb-2">
                <div className="flex flex-col mb-5">
                    <Image
                        src="/trv-logo.svg"
                        alt="TRV"
                        width={160}
                        height={36}
                        className="brightness-0 invert mb-[-4px] select-none"
                        priority
                    />
                    <h1 className="text-[42px] font-black tracking-[-0.04em] text-white leading-none select-none">
                        MEMBERS
                    </h1>
                </div>
                <p className="text-trv-blue-dark/60 text-[15px] font-medium max-w-[280px] leading-tight select-none mix-blend-color-burn">
                    Состав электронных и экспериментальных визионеров от лейбла TRV.
                </p>
            </div>

            {/* Filter Tabs */}
            <div className="pt-0">
                <FilterTabs
                    options={filterOptions}
                    activeOption={memberFilter}
                    onSelect={setMemberFilter}
                />
            </div>

            {/* Members Grid */}
            <section className="px-5">
                <div className="grid grid-cols-2 gap-x-5 gap-y-10">
                    {isLoading
                        ? Array.from({ length: 6 }).map((_, i) => (
                            <MemberCardSkeleton key={i} />
                        ))
                        : artists?.map((artist) => (
                            <MemberCard key={artist.id} artist={artist} />
                        ))}
                </div>
            </section>
        </div>
    );
}
