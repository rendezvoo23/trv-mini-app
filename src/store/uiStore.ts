'use client';

import { create } from 'zustand';
import { ReleaseSort, MerchSort, MemberFilterCategory } from '@/types';

interface UIState {
    releaseSort: ReleaseSort;
    setReleaseSort: (sort: ReleaseSort) => void;
    memberFilter: MemberFilterCategory;
    setMemberFilter: (filter: MemberFilterCategory) => void;
    merchSort: MerchSort;
    setMerchSort: (sort: MerchSort) => void;
}

export const useUIStore = create<UIState>((set) => ({
    releaseSort: 'newest',
    setReleaseSort: (sort) => set({ releaseSort: sort }),
    memberFilter: 'All',
    setMemberFilter: (filter) => set({ memberFilter: filter }),
    merchSort: 'newest',
    setMerchSort: (sort) => set({ merchSort: sort }),
}));
