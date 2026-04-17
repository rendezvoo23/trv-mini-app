'use client';

import { useRelease } from '@/lib/hooks/useReleases';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { openExternalLink } from '@/lib/telegram';
import { Play } from 'lucide-react';

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
            <div className="absolute top-4 left-4 z-10">
                <button
                    onClick={() => router.back()}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md text-white hover:bg-black/40 transition-colors"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                </button>
            </div>

            {/* Cover */}
            <div className="w-full relative aspect-square bg-muted shadow-sm">
                <Image
                    src={release.cover_url}
                    alt={release.title}
                    fill
                    sizes="100vw"
                    className="object-cover"
                    priority
                />
                {release.is_upcoming && (
                    <div className="absolute top-4 right-4">
                        <Badge className="bg-white/90 backdrop-blur-md text-trv-blue font-bold text-xs px-3 py-1.5 shadow-lg">
                            UPCOMING
                        </Badge>
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="px-5 py-6 flex flex-col min-h-[300px]">
                <div className="flex items-start justify-between">
                    <div>
                        <div className="text-[13px] font-medium text-[#8A8A8E] mb-1">
                            {release.type}
                        </div>
                        <h1 className="text-[28px] leading-tight font-medium text-foreground tracking-[-0.02em] max-w-[200px]">
                            {release.title}
                        </h1>
                        <p className="text-[17px] font-medium text-[#8A8A8E] mt-0.5 tracking-tight">
                            {mainArtists}
                        </p>
                    </div>

                    <Button
                        className="bg-trv-blue hover:bg-trv-blue-dark text-white font-bold rounded-2xl h-[46px] px-6 text-[15px] flex items-center gap-2 shadow-sm transition-transform active:scale-95"
                        onClick={() => openExternalLink(release.listen_url)}
                    >
                        <Play className="w-5 h-5 fill-white" />
                        Слушать
                    </Button>
                </div>

                <div className="mt-8 space-y-6">
                    <p className="text-[16px] text-[#2C2C2E] leading-[1.6] tracking-[-0.01em]">
                        {release.description}
                    </p>

                    {producers.length > 0 && (
                        <p className="text-[13px] text-[#8A8A8E]">
                            Produced by{' '}
                            <span className="font-medium text-foreground">
                                {producers.join(', ')}
                            </span>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
