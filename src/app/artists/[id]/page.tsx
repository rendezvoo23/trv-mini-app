'use client';

import { useArtist } from '@/lib/hooks/useArtists';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ReleaseCard } from '@/components/cards/ReleaseCard';
import { MerchCard } from '@/components/cards/MerchCard';
import { Artist } from '@/types';

const roleLabels: Record<string, string> = {
    artist: 'Artist',
    producer: 'Producer',
    designer: 'Designer',
    dj: 'DJ',
};

export default function ArtistDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { data: artist, isLoading } = useArtist(params.id as string);

    if (isLoading) {
        return (
            <div className="space-y-4 p-4">
                <div className="flex justify-center">
                    <Skeleton className="w-40 h-40 rounded-full" />
                </div>
                <Skeleton className="h-6 w-40 mx-auto" />
                <Skeleton className="h-4 w-24 mx-auto" />
                <Skeleton className="h-20 w-full" />
            </div>
        );
    }

    if (!artist) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <p className="text-muted-foreground">Artist not found</p>
            </div>
        );
    }

    // For producers: show produced releases instead of regular releases
    const isProducer = artist.role === 'producer';

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

            {/* Profile Header */}
            <div className="flex flex-col items-center px-4 pb-6">
                <div className="relative w-36 h-36 rounded-full overflow-hidden bg-muted ring-4 ring-trv-blue-50 mb-4">
                    <Image
                        src={artist.photo_url}
                        alt={artist.name}
                        fill
                        sizes="144px"
                        className="object-cover"
                        priority
                    />
                </div>
                <h1 className="text-2xl font-black tracking-tight text-foreground">
                    {artist.name}
                </h1>
                <Badge className="mt-2 bg-trv-blue text-white font-bold text-xs px-4 py-1">
                    {roleLabels[artist.role]}
                </Badge>
            </div>

            {/* Bio */}
            <div className="px-4 pb-6">
                <p className="text-sm text-muted-foreground leading-relaxed">
                    {artist.bio}
                </p>
            </div>

            {/* Pinned / Recent Releases */}
            {artist.releases.length > 0 && (
                <section className="px-4 pb-6 space-y-4">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-trv-blue">
                        {isProducer ? 'Featured On' : 'Releases'}
                    </h2>
                    {artist.releases.map((release) => (
                        <ReleaseCard key={release.id} release={release} />
                    ))}
                </section>
            )}

            {/* Produced Releases (for producers) */}
            {isProducer && artist.producedReleases.length > 0 && (
                <section className="px-4 pb-6 space-y-4">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-trv-blue">
                        Produced
                    </h2>
                    {artist.producedReleases.map((release) => (
                        <ReleaseCard key={release.id} release={release} />
                    ))}
                </section>
            )}

            {/* Merch */}
            {artist.merch.length > 0 && (
                <section className="px-4 pb-6 space-y-4">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-trv-blue">
                        Merch
                    </h2>
                    <div className="grid grid-cols-2 gap-3">
                        {artist.merch.map((item) => (
                            <MerchCard
                                key={item.id}
                                item={{ ...item, artist: artist as Artist }}
                            />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
