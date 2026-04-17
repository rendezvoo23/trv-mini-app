'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Artist } from '@/types';

interface MemberCardProps {
    artist: Artist;
}

export function MemberCard({ artist }: MemberCardProps) {
    return (
        <Link
            href={`/artists/${artist.id}`}
            className="flex flex-col items-center group animate-fade-in active:scale-95 transition-transform"
        >
            <div className="relative w-36 h-36 rounded-full overflow-hidden mb-3 bg-muted/30 ring-2 ring-transparent group-hover:ring-trv-blue/50 shadow-sm transition-all duration-300">
                <Image
                    src={artist.photo_url}
                    alt={artist.name}
                    fill
                    sizes="144px"
                    className="object-cover"
                    loading="lazy"
                />
            </div>
            <h3 className="text-[15px] font-medium text-foreground text-center tracking-tight">
                {artist.name}
            </h3>
        </Link>
    );
}
