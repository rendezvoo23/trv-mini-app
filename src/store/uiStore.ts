'use client';

import { create } from 'zustand';
import { MemberFilterCategory, MerchSort } from '@/domain/view-models';

interface UIState {
    memberFilter: MemberFilterCategory;
    setMemberFilter: (filter: MemberFilterCategory) => void;
    merchSort: MerchSort;
    setMerchSort: (sort: MerchSort) => void;
}

export const useUIStore = create<UIState>((set) => ({
    memberFilter: 'All',
    setMemberFilter: (filter) => set({ memberFilter: filter }),
    merchSort: 'newest',
    setMerchSort: (sort) => set({ merchSort: sort }),
}));
