'use client';

import { useRelease } from '@/lib/hooks/useReleases';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { openExternalLink } from '@/lib/telegram';

const typeColors: Record<string, string> = {
    single: 'bg-trv-blue text-white',
    ep: 'bg-trv-blue-light text-white',
    album: 'bg-trv-blue-dark text-white',
    mixtape: 'bg-gray-700 text-white',
};

export default function ReleaseDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { data: release, isLoading } = useRelease(params.id as string);

    if (isLoading) {
        return (
            <div className="space-y-4 p-4">
                <Skeleton className="aspect-square rounded-xl" />
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-20 w-full" />
            </div>
        );
    }

    if (!release) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <p className="text-muted-foreground">Release not found</p>
            </div>
        );
    }

    const mainArtists = release.artists
        .filter((a) => a.role === 'main' || a.role === 'feat')
        .map((a) => (a.role === 'feat' ? `feat. ${a.artist.name}` : a.artist.name))
        .join(', ');

    const producers = release.artists
        .filter((a) => a.role === 'producer')
        .map((a) => a.artist.name);

    return (
        <div className="animate-fade-in">
            {/* Back button */}
            <div className="px-4 py-3">
                <button
                    onClick={() => router.back()}
                    className="text-sm font-medium text-trv-blue hover:text-trv-blue-dark transition-colors"
                >
                    ← Back
                </button>
            </div>

            {/* Cover */}
            <div className="px-4">
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted">
                    <Image
                        src={release.cover_url}
                        alt={release.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 600px"
                        className="object-cover"
                        priority
                    />
                    {release.is_upcoming && (
                        <div className="absolute top-4 left-4">
                            <Badge className="bg-white text-trv-blue font-bold text-sm px-4 py-1.5 shadow-lg">
                                UPCOMING
                            </Badge>
                        </div>
                    )}
                </div>
            </div>

            {/* Info */}
            <div className="px-4 py-5 space-y-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Badge className={`${typeColors[release.type]} text-xs uppercase font-bold px-3 py-1`}>
                            {release.type}
                        </Badge>
                        <Badge variant="secondary" className="text-xs font-medium">
                            {release.genre.name}
                        </Badge>
                    </div>
                    <h1 className="text-2xl font-black tracking-tight text-foreground mt-2">
                        {release.title}
                    </h1>
                    <p className="text-base font-medium text-muted-foreground mt-1">
                        {mainArtists}
                    </p>
                </div>

                {producers.length > 0 && (
                    <p className="text-sm text-muted-foreground">
                        Produced by{' '}
                        <span className="font-semibold text-foreground">
                            {producers.join(', ')}
                        </span>
                    </p>
                )}

                <p className="text-sm text-muted-foreground leading-relaxed">
                    {release.description}
                </p>

                <p className="text-xs text-muted-foreground">
                    {new Date(release.release_date).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                    })}
                </p>

                <Button
                    className="w-full bg-trv-blue hover:bg-trv-blue-dark text-white font-bold rounded-xl h-12 text-base"
                    onClick={() => openExternalLink(release.listen_url)}
                >
                    Listen
                </Button>
            </div>
        </div>
    );
}
