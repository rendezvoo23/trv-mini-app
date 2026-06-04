'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

export function BackButton() {
    const router = useRouter();

    return (
        <button
            onClick={() => router.back()}
            className="flex h-6 w-6 items-center justify-center text-black active:opacity-60"
            aria-label="Back"
        >
            <ChevronLeft className="h-5 w-5" strokeWidth={2.2} />
        </button>
    );
}
