import Image from 'next/image';
import { ArtistsListClient } from '@/components/artists/ArtistsListClient';
import { ArtistListItemViewModel } from '@/domain/view-models';
import { getArtists } from '@/lib/services/artists';
import { PUBLIC_DATA_REVALIDATE_SECONDS } from '@/lib/supabase/publicServer';

export const revalidate = PUBLIC_DATA_REVALIDATE_SECONDS;

export default async function ArtistsPage() {
    let artists: ArtistListItemViewModel[] = [];
    let hasError = false;

    try {
        artists = await getArtists('All');
    } catch {
        hasError = true;
    }

    return (
        <div
            className="min-h-screen bg-[#f4f4f1] pb-24 pt-6 text-black"
            style={{ fontFamily: 'Arial, sans-serif' }}
        >
            <header className="mb-8 flex items-center justify-center px-6">
                <Image
                    src="/trv-logo.svg"
                    alt="TRV"
                    width={140}
                    height={40}
                    priority
                    className="h-auto w-[140px]"
                />
            </header>

            {hasError ? (
                <section className="px-6">
                    <p className="border border-black px-4 py-3 text-sm text-black">
                        Unable to load members right now.
                    </p>
                </section>
            ) : (
                <ArtistsListClient artists={artists} />
            )}
        </div>
    );
}
