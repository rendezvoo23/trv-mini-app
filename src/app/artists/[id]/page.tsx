'use client';

import { useArtist } from '@/lib/hooks/useArtists';
import { isPublicSectionEnabled } from '@/domain/featureFlags';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { MerchCard } from '@/components/cards/MerchCard';
import { ReleaseCard } from '@/components/cards/ReleaseCard';

export default function ArtistDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { data: artist, isLoading, isError } = useArtist(params.id as string);
    const showPublicMerch = isPublicSectionEnabled('merch');

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

    if (isError) {
        return (
            <div className="flex items-center justify-center min-h-[50vh] px-6 text-center">
                <p className="text-muted-foreground">
                    Unable to load this member right now.
                </p>
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
                    {artist.photo && (
                        <Image
                            src={artist.photo.url}
                            alt={artist.photo.alt}
                            fill
                            sizes="144px"
                            className="object-cover"
                            priority
                        />
                    )}
                </div>
                <h1 className="text-2xl font-black tracking-tight text-foreground">
                    {artist.name}
                </h1>
                <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
                    {artist.roleLabels.map((roleLabel) => (
                        <Badge
                            key={roleLabel}
                            className="bg-trv-blue text-white font-bold text-xs px-4 py-1"
                        >
                            {roleLabel}
                        </Badge>
                    ))}
                </div>
            </div>

            {/* Bio */}
            <div className="px-4 pb-6">
                <p className="text-sm text-muted-foreground leading-relaxed">
                    {artist.bio}
                </p>
            </div>

            {artist.artistReleases.length > 0 && (
                <section className="px-4 pb-6 space-y-4">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-trv-blue">
                        Releases
                    </h2>
                    {artist.artistReleases.map((release) => (
                        <ReleaseCard key={release.id} release={release} />
                    ))}
                </section>
            )}

            {artist.supportReleases.length > 0 && (
                <section className="px-4 pb-6 space-y-4">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-trv-blue">
                        Contributions
                    </h2>
                    {artist.supportReleases.map((release) => (
                        <ReleaseCard key={release.id} release={release} />
                    ))}
                </section>
            )}

            {showPublicMerch && artist.merchItems.length > 0 && (
                <section className="px-4 pb-6 space-y-4">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-trv-blue">
                        Merch
                    </h2>
                    <div className="grid grid-cols-2 gap-3">
                        {artist.merchItems.map((item) => (
                            <MerchCard key={item.id} item={item} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
