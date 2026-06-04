import Image from 'next/image';
import { BackButton } from '@/components/BackButton';
import { MerchCard } from '@/components/cards/MerchCard';
import { ReleaseGlassCard } from '@/components/cards/ReleaseGlassCard';
import { isPublicSectionEnabled } from '@/domain/featureFlags';
import { getArtistById } from '@/lib/services/artists';
import { PUBLIC_DATA_REVALIDATE_SECONDS } from '@/lib/supabase/publicServer';

export const revalidate = PUBLIC_DATA_REVALIDATE_SECONDS;

interface ArtistDetailPageProps {
    params: {
        id: string;
    };
}

export default async function ArtistDetailPage({ params }: ArtistDetailPageProps) {
    const showPublicMerch = isPublicSectionEnabled('merch');
    let artist = null;
    let hasError = false;

    try {
        artist = await getArtistById(params.id);
    } catch {
        hasError = true;
    }

    if (hasError) {
        return (
            <div
                className="flex min-h-screen items-center justify-center bg-[#f4f4f1] px-6 text-center"
                style={{ fontFamily: 'Arial, sans-serif' }}
            >
                <p className="text-sm text-black">
                    Unable to load this member right now.
                </p>
            </div>
        );
    }

    if (!artist) {
        return (
            <div
                className="flex min-h-screen items-center justify-center bg-[#f4f4f1]"
                style={{ fontFamily: 'Arial, sans-serif' }}
            >
                <p className="text-sm text-black">Artist not found</p>
            </div>
        );
    }

    return (
        <div
            className="min-h-screen bg-[#f4f4f1] px-6 pb-24 pt-6 text-black"
            style={{ fontFamily: 'Arial, sans-serif' }}
        >
            <header className="mb-8 grid grid-cols-[24px_1fr_24px] items-center">
                <BackButton />
                <div className="flex justify-center">
                    <Image
                        src="/trv-logo.svg"
                        alt="TRV"
                        width={140}
                        height={40}
                        priority
                        className="h-auto w-[140px]"
                    />
                </div>
                <div />
            </header>

            <div className="flex flex-col items-center">
                <div className="relative mb-5 h-40 w-40 overflow-hidden rounded-full border border-black bg-white">
                    {artist.photo ? (
                        <Image
                            src={artist.photo.url}
                            alt={artist.photo.alt}
                            fill
                            sizes="160px"
                            className="object-cover"
                            priority
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-sm uppercase tracking-[0.22em] text-[#8c8c8c]">
                            TRV
                        </div>
                    )}
                </div>
                <h1 className="text-center text-[30px] leading-none text-black">
                    {artist.name}
                </h1>
                <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                    {artist.roleLabels.map((roleLabel) => (
                        <span
                            key={roleLabel}
                            className="border border-black px-3 py-1 text-[12px] uppercase tracking-[0.12em] text-black"
                        >
                            {roleLabel}
                        </span>
                    ))}
                </div>
            </div>

            <div className="my-8 h-px w-full bg-black" />

            <div>
                <p className="text-[16px] leading-[1.5] text-[#202020]">
                    {artist.bio || 'Описание пока не добавлено.'}
                </p>
            </div>

            {artist.artistReleases.length > 0 && (
                <section className="mt-10 space-y-4">
                    <h2 className="text-[13px] uppercase tracking-[0.18em] text-[#707070]">
                        Releases
                    </h2>
                    {artist.artistReleases.map((release) => (
                        <ReleaseGlassCard key={release.id} release={release} />
                    ))}
                </section>
            )}

            {artist.supportReleases.length > 0 && (
                <section className="mt-10 space-y-4">
                    <h2 className="text-[13px] uppercase tracking-[0.18em] text-[#707070]">
                        Contributions
                    </h2>
                    {artist.supportReleases.map((release) => (
                        <ReleaseGlassCard key={release.id} release={release} />
                    ))}
                </section>
            )}

            {showPublicMerch && artist.merchItems.length > 0 && (
                <section className="mt-10 space-y-4">
                    <h2 className="text-[13px] uppercase tracking-[0.18em] text-[#707070]">
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
