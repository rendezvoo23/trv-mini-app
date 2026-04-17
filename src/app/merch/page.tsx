'use client';

import { useMerchItems } from '@/lib/hooks/useMerch';
import { useUIStore } from '@/store/uiStore';
import { MerchCard } from '@/components/cards/MerchCard';
import { MerchCardSkeleton } from '@/components/skeletons/MerchCardSkeleton';
import { FilterTabs } from '@/components/FilterTabs';
import { MERCH_SORT_OPTIONS } from '@/domain/config';

export default function MerchPage() {
    const { merchSort, setMerchSort } = useUIStore();
    const { data: items, isLoading } = useMerchItems(merchSort);

    return (
        <div className="space-y-6">
            {/* Sort Tabs */}
            <div className="pt-4">
                <FilterTabs
                    options={MERCH_SORT_OPTIONS}
                    activeOption={merchSort}
                    onSelect={setMerchSort}
                />
            </div>

            {/* Merch Grid */}
            <section className="px-4">
                <div className="grid grid-cols-2 gap-3">
                    {isLoading
                        ? Array.from({ length: 4 }).map((_, i) => (
                            <MerchCardSkeleton key={i} />
                        ))
                        : items?.map((item) => (
                            <MerchCard key={item.id} item={item} />
                        ))}
                </div>
            </section>
        </div>
    );
}
