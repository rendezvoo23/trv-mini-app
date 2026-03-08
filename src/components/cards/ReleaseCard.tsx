'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ReleaseWithArtists } from '@/types';
import { openExternalLink } from '@/lib/telegram';

interface ReleaseCardProps {
    release: ReleaseWithArtists;
}

const typeColors: Record<string, string> = {
    single: 'bg-trv-blue text-white',
    ep: 'bg-trv-blue-light text-white',
    album: 'bg-trv-blue-dark text-white',
    mixtape: 'bg-gray-700 text-white',
};

export function ReleaseCard({ release }: ReleaseCardProps) {
    const mainArtists = release.artists
        .filter((a) => a.role === 'main' || a.role === 'feat')
        .map((a) => (a.role === 'feat' ? `feat. ${a.artist.name}` : a.artist.name))
        .join(', ');

    return (
        <div className="animate-fade-in">
            <Link href={`/releases/${release.id}`} className="block group">
                <div className="relative aspect-square rounded-xl overflow-hidden mb-3 bg-muted">
                    <Image
                        src={release.cover_url}
                        alt={release.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 600px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                    />
                    {release.is_upcoming && (
                        <div className="absolute top-3 left-3">
                            <Badge className="bg-white text-trv-blue font-bold text-xs px-3 py-1 shadow-md">
                                UPCOMING
                            </Badge>
                        </div>
                    )}
                    <div className="absolute top-3 right-3">
                        <Badge className={`${typeColors[release.type]} text-xs px-3 py-1 uppercase font-bold`}>
                            {release.type}
                        </Badge>
                    </div>
                </div>
            </Link>

            <div className="space-y-1.5 px-1">
                <p className="text-sm font-medium text-muted-foreground">{mainArtists}</p>
                <Link href={`/releases/${release.id}`}>
                    <h3 className="text-lg font-bold text-foreground tracking-tight leading-tight hover:text-trv-blue transition-colors">
                        {release.title}
                    </h3>
                </Link>
                <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-muted-foreground">
                        {new Date(release.release_date).toLocaleDateString('ru-RU', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                        })}
                    </span>
                    <Button
                        size="sm"
                        className="bg-trv-blue hover:bg-trv-blue-dark text-white text-xs font-bold rounded-full px-5 h-8"
                        onClick={(e) => {
                            e.preventDefault();
                            openExternalLink(release.listen_url);
                        }}
                    >
                        Listen
                    </Button>
                </div>
            </div>
        </div>
    );
}
