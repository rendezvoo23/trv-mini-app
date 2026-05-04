'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArtistListItemViewModel } from '@/domain/view-models';

interface MemberCardProps {
    artist: ArtistListItemViewModel;
}

export function MemberCard({ artist }: MemberCardProps) {
    return (
        <Link
            href={`/artists/${artist.id}`}
            className="flex flex-col items-center text-black active:opacity-70"
            style={{ fontFamily: 'Arial, sans-serif' }}
        >
            <div className="relative mb-3 h-36 w-36 overflow-hidden rounded-full border border-black bg-white">
                {artist.photo ? (
                    <Image
                        src={artist.photo.url}
                        alt={artist.photo.alt}
                        fill
                        sizes="144px"
                        className="object-cover"
                        loading="lazy"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs uppercase tracking-[0.2em] text-[#8a8a8a]">
                        TRV
                    </div>
                )}
            </div>
            <h3 className="text-center text-[15px] leading-tight text-black">
                {artist.name}
            </h3>
        </Link>
    );
}
