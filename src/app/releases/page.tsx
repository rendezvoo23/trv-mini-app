import { ReleaseGlassCard } from '@/components/cards/ReleaseGlassCard';
import Image from 'next/image';
import { ReleaseSummaryViewModel } from '@/domain/view-models';
import { getReleases } from '@/lib/services/releases';
import { PUBLIC_DATA_REVALIDATE_SECONDS } from '@/lib/supabase/publicServer';

export const revalidate = PUBLIC_DATA_REVALIDATE_SECONDS;

export default async function ReleasesPage() {
    let releases: ReleaseSummaryViewModel[] = [];
    let hasError = false;

    try {
        releases = await getReleases('newest');
    } catch {
        hasError = true;
    }

    return (
        <div
            className="min-h-screen bg-[#f4f4f1] px-6 pb-24 pt-6 text-black"
            style={{ fontFamily: 'Arial, sans-serif' }}
        >
            <header className="mb-10 flex items-center justify-center">
                <Image
                    src="/trv-logo.svg"
                    alt="TRV"
                    width={140}
                    height={40}
                    priority
                    className="h-auto w-[140px]"
                />
            </header>

            <section className="space-y-14">
                {hasError ? (
                    <p className="border border-black px-4 py-3 text-sm text-black">
                        Unable to load releases right now.
                    </p>
                ) : releases.length === 0 ? (
                    <p className="border border-black px-4 py-3 text-sm text-black">
                        No releases found
                    </p>
                ) : (
                    releases.map((release) => (
                        <ReleaseGlassCard key={release.id} release={release} />
                    ))
                )}
            </section>
        </div>
    );
}
