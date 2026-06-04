'use client';

import { MemberCard } from '@/components/cards/MemberCard';
import { FilterTabs } from '@/components/FilterTabs';
import { MEMBER_FILTER_OPTIONS, matchesMemberFilter } from '@/domain/config';
import { ArtistListItemViewModel } from '@/domain/view-models';
import { useUIStore } from '@/store/uiStore';

interface ArtistsListClientProps {
    artists: ArtistListItemViewModel[];
}

export function ArtistsListClient({ artists }: ArtistsListClientProps) {
    const { memberFilter, setMemberFilter } = useUIStore();
    const filteredArtists = artists.filter((artist) =>
        matchesMemberFilter(artist.roleKeys, memberFilter)
    );

    return (
        <>
            <div className="mb-4">
                <FilterTabs
                    options={MEMBER_FILTER_OPTIONS}
                    activeOption={memberFilter}
                    onSelect={setMemberFilter}
                />
            </div>

            <section className="px-6">
                <div className="grid grid-cols-2 gap-x-6 gap-y-10">
                    {filteredArtists.length === 0 ? (
                        <p className="col-span-2 border border-black px-4 py-3 text-sm text-black">
                            No members found
                        </p>
                    ) : (
                        filteredArtists.map((artist) => (
                            <MemberCard key={artist.id} artist={artist} />
                        ))
                    )}
                </div>
            </section>
        </>
    );
}
