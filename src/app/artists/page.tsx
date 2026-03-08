'use client';

import { useArtists } from '@/lib/hooks/useArtists';
import { useUIStore } from '@/store/uiStore';
import { MemberCard } from '@/components/cards/MemberCard';
import { MemberCardSkeleton } from '@/components/skeletons/MemberCardSkeleton';
import { FilterTabs } from '@/components/FilterTabs';
import { ArtistRole, MemberFilterCategory } from '@/types';

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
            {/* Filter Tabs */}
            <div className="pt-4">
                <FilterTabs
                    options={filterOptions}
                    activeOption={memberFilter}
                    onSelect={setMemberFilter}
                />
            </div>

            {/* Members Grid */}
            <section className="px-4">
                <div className="grid grid-cols-3 gap-x-4 gap-y-6">
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
