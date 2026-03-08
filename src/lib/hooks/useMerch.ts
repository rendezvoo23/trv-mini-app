'use client';

import { useQuery } from '@tanstack/react-query';
import { getMerchItems, getMerchById } from '@/lib/services/merch';
import { MerchSort } from '@/types';

export function useMerchItems(sort: MerchSort = 'newest') {
    return useQuery({
        queryKey: ['merch', sort],
        queryFn: () => getMerchItems(sort),
    });
}

export function useMerch(id: string) {
    return useQuery({
        queryKey: ['merch-item', id],
        queryFn: () => getMerchById(id),
        enabled: !!id,
    });
}
