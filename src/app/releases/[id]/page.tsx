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
    const { data: release, isLoading, isError } = useRelease(params.id as string);

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

    if (isError) {
        return (
            <div className="flex items-center justify-center min-h-[50vh] px-6 text-center">
                <p className="text-muted-foreground">
                    Unable to load this release right now.
                </p>
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

    const listenLink = release.listenLink;

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
                {release.cover && (
                    <Image
                        src={release.cover.url}
                        alt={release.cover.alt}
                        fill
                        sizes="100vw"
                        className="object-cover"
                        priority
                    />
                )}
                {release.isUpcoming && (
                    <div className="absolute top-4 right-4">
                        <Badge className="bg-white/90 backdrop-blur-md text-trv-blue font-bold text-xs px-3 py-1.5 shadow-lg">
                            UPCOMING
                        </Badge>
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="px-5 py-6 flex flex-col min-h-[300px]">
                <div className="text-[13px] font-medium text-[#8A8A8E] mb-1.5">
                    {release.typeLabel}
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-[28px] leading-tight font-medium text-foreground tracking-[-0.02em] max-w-[200px]">
                            {release.title}
                        </h1>
                        <p className="text-[17px] font-medium text-[#8A8A8E] mt-0.5 tracking-tight">
                            {release.artistLine}
                        </p>
                    </div>

                    {listenLink && (
                        <Button
                            className="bg-[#007AFF] hover:bg-[#007AFF]/90 text-white font-bold rounded-[14px] h-[46px] px-6 text-[15px] flex items-center gap-2 shadow-sm transition-transform active:scale-95"
                            onClick={() => openExternalLink(listenLink.url)}
                        >
                            <Play className="w-5 h-5 fill-white" />
                            {listenLink.label}
                        </Button>
                    )}
                </div>

                <div className="mt-8 space-y-6">
                    <p className="text-[16px] text-[#2C2C2E] leading-[1.6] tracking-[-0.01em]">
                        {release.description}
                    </p>

                    {release.producerLine && (
                        <p className="text-[13px] text-[#8A8A8E]">
                            Produced by{' '}
                            <span className="font-medium text-foreground">
                                {release.producerLine}
                            </span>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
