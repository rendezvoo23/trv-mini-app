'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ReleaseSummaryViewModel } from '@/domain/view-models';
import { openExternalLink } from '@/lib/telegram';

interface ReleaseGlassCardProps {
    release: ReleaseSummaryViewModel;
}

export function ReleaseGlassCard({ release }: ReleaseGlassCardProps) {
    const listenLink = release.listenLink;

    return (
        <article
            className="border border-black bg-white p-2 text-black"
            style={{ fontFamily: 'Arial, sans-serif' }}
        >
            <div className="grid grid-cols-[165px_minmax(0,1fr)] gap-4">
                <Link href={`/releases/${release.id}`} className="block">
                    <div className="relative aspect-square overflow-hidden bg-[#f1f1f1]">
                        {release.cover ? (
                            <Image
                                src={release.cover.url}
                                alt={release.cover.alt || release.title}
                                fill
                                sizes="165px"
                                className="object-cover"
                                loading="lazy"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs uppercase tracking-[0.2em] text-[#8a8a8a]">
                                TRV
                            </div>
                        )}
                    </div>
                </Link>

                <Link
                    href={`/releases/${release.id}`}
                    className="flex min-w-0 flex-col justify-center pr-1"
                >
                    <span className="mb-1 text-[14px] lowercase text-[#b4b4b4]">
                        {(release.typeLabel || release.type || 'single').toLowerCase()}
                    </span>
                    <h3 className="text-[20px] leading-[1.05] text-black">
                        {release.title || 'Untitled release'}
                    </h3>
                    <p className="mt-1 text-[18px] font-bold leading-tight text-[#7d7d7d]">
                        {release.artistLine || 'TRV'}
                    </p>
                </Link>
            </div>

            <div className="mt-6">
                <button
                    type="button"
                    onClick={() => {
                        if (listenLink) {
                            openExternalLink(listenLink.url);
                        }
                    }}
                    disabled={!listenLink}
                    className="flex h-[42px] w-full items-center justify-center border border-black bg-white text-[16px] text-black transition-colors active:bg-[#ececec] disabled:cursor-not-allowed disabled:text-[#9d9d9d]"
                    aria-label={listenLink ? `Слушать ${release.title}` : 'Ссылка недоступна'}
                >
                    <span>Слушать</span>
                </button>
            </div>
        </article>
    );
}
