'use client';

import { useRelease } from '@/lib/hooks/useReleases';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { openExternalLink } from '@/lib/telegram';
import { ChevronLeft } from 'lucide-react';

export default function ReleaseDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { data: release, isLoading, isError } = useRelease(params.id as string);

    if (isLoading) {
        return (
            <div
                className="min-h-screen bg-[#f4f4f1] px-6 pb-24 pt-6 text-black"
                style={{ fontFamily: 'Arial, sans-serif' }}
            >
                <div className="mb-8 flex items-center justify-between">
                    <Skeleton className="h-6 w-6 rounded-none bg-[#dddddd]" />
                    <Skeleton className="h-8 w-32 rounded-none bg-[#dddddd]" />
                    <div className="w-6" />
                </div>
                <Skeleton className="aspect-square w-full rounded-none bg-[#dddddd]" />
                <div className="mt-6 grid grid-cols-[1fr_132px] gap-5">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-14 rounded-none bg-[#dddddd]" />
                        <Skeleton className="h-8 w-32 rounded-none bg-[#dddddd]" />
                        <Skeleton className="h-6 w-28 rounded-none bg-[#dddddd]" />
                    </div>
                    <Skeleton className="mt-4 h-[44px] w-full rounded-none bg-[#dddddd]" />
                </div>
                <Skeleton className="mt-8 h-px w-full rounded-none bg-[#dddddd]" />
                <div className="mt-8 space-y-2">
                    <Skeleton className="h-4 w-full rounded-none bg-[#dddddd]" />
                    <Skeleton className="h-4 w-[92%] rounded-none bg-[#dddddd]" />
                    <Skeleton className="h-4 w-[88%] rounded-none bg-[#dddddd]" />
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div
                className="flex min-h-screen items-center justify-center bg-[#f4f4f1] px-6 text-center"
                style={{ fontFamily: 'Arial, sans-serif' }}
            >
                <p className="text-sm text-black">
                    Unable to load this release right now.
                </p>
            </div>
        );
    }

    if (!release) {
        return (
            <div
                className="flex min-h-screen items-center justify-center bg-[#f4f4f1]"
                style={{ fontFamily: 'Arial, sans-serif' }}
            >
                <p className="text-sm text-black">Release not found</p>
            </div>
        );
    }

    const listenLink = release.listenLink;

    return (
        <div
            className="min-h-screen bg-[#f4f4f1] px-6 pb-24 pt-6 text-black"
            style={{ fontFamily: 'Arial, sans-serif' }}
        >
            <header className="mb-8 grid grid-cols-[24px_1fr_24px] items-center">
                <button
                    onClick={() => router.back()}
                    className="flex h-6 w-6 items-center justify-center text-black active:opacity-60"
                    aria-label="Back"
                >
                    <ChevronLeft className="h-5 w-5" strokeWidth={2.2} />
                </button>
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

            <div className="relative aspect-square w-full bg-[#ededed]">
                {release.cover ? (
                    <Image
                        src={release.cover.url}
                        alt={release.cover.alt || release.title}
                        fill
                        sizes="100vw"
                        className="object-cover"
                        priority
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm uppercase tracking-[0.22em] text-[#8c8c8c]">
                        TRV
                    </div>
                )}
            </div>

            <div className="mt-5 grid grid-cols-[1fr_132px] gap-5">
                <div className="min-w-0">
                    <p className="mb-1 text-[14px] lowercase text-[#b2b2b2]">
                        {(release.typeLabel || release.type || 'single').toLowerCase()}
                    </p>
                    <h1 className="text-[20px] leading-[1.05] text-black">
                        {release.title}
                    </h1>
                    <p className="mt-1 text-[18px] font-bold leading-tight text-[#7d7d7d]">
                        {release.artistLine}
                    </p>
                </div>

                <div className="flex items-start">
                    <button
                        type="button"
                        onClick={() => {
                            if (listenLink) {
                                openExternalLink(listenLink.url);
                            }
                        }}
                        disabled={!listenLink}
                        className="mt-3 flex h-[44px] w-full items-center justify-center border border-black bg-white text-[16px] text-black active:bg-[#ececec] disabled:cursor-not-allowed disabled:text-[#9d9d9d]"
                    >
                        <span>Слушать</span>
                    </button>
                </div>
            </div>

            <div className="my-8 h-px w-full bg-black" />

            <div className="space-y-5">
                <p className="text-[16px] leading-[1.5] text-[#202020]">
                    {release.description || 'Описание пока не добавлено.'}
                </p>

                {release.producerLine ? (
                    <p className="text-[15px] leading-[1.4] text-[#5f5f5f]">
                        Produced by {release.producerLine}
                    </p>
                ) : null}
            </div>
        </div>
    );
}
