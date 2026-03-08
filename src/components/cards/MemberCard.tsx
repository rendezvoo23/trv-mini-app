'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Artist } from '@/types';

interface MemberCardProps {
    artist: Artist;
}

const roleLabels: Record<string, string> = {
    artist: 'Artist',
    producer: 'Producer',
    designer: 'Designer',
    dj: 'DJ',
};

export function MemberCard({ artist }: MemberCardProps) {
    return (
        <Link
            href={`/artists/${artist.id}`}
            className="flex flex-col items-center group animate-fade-in"
        >
            <div className="relative w-28 h-28 rounded-full overflow-hidden mb-3 bg-muted ring-2 ring-transparent group-hover:ring-trv-blue transition-all duration-300">
                <Image
                    src={artist.photo_url}
                    alt={artist.name}
                    fill
                    sizes="112px"
                    className="object-cover"
                    loading="lazy"
                />
            </div>
            <h3 className="text-sm font-bold text-foreground text-center tracking-tight">
                {artist.name}
            </h3>
            <Badge
                variant="secondary"
                className="mt-1 text-[10px] font-semibold bg-trv-blue-50 text-trv-blue-dark"
            >
                {roleLabels[artist.role]}
            </Badge>
        </Link>
    );
}
