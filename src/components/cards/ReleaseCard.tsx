'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Play } from 'lucide-react';
import { ReleaseSummaryViewModel } from '@/domain/view-models';
import { openExternalLink } from '@/lib/telegram';

interface ReleaseCardProps {
    release: ReleaseSummaryViewModel;
}

export function ReleaseCard({ release }: ReleaseCardProps) {
    const listenLink = release.listenLink;

    return (
        <div className="animate-fade-in w-full pb-8">
            <Link href={`/releases/${release.id}`} className="block group">
                <div className="relative w-full aspect-square rounded-[24px] overflow-hidden mb-4 bg-muted/40 shadow-sm">
                    {release.cover && (
                        <Image
                            src={release.cover.url}
                            alt={release.cover.alt}
                            fill
                            sizes="100vw"
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                            loading="lazy"
                        />
                    )}
                </div>
            </Link>

            <div className="px-1">
                <span className="text-[13px] font-medium text-gray-400 block mb-1">
                    {release.typeLabel}
                </span>
                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <Link href={`/releases/${release.id}`}>
                            <h3 className="text-[22px] font-medium text-black leading-tight tracking-tight">
                                {release.artistLine}
                            </h3>
                        </Link>
                        <span className="text-[15px] font-medium text-gray-500 mt-0.5">{release.title}</span>
                    </div>
                    
                    {listenLink && (
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                openExternalLink(listenLink.url);
                            }}
                            className="bg-[#007AFF] hover:bg-[#007AFF]/90 active:scale-95 transition-all flex items-center justify-center gap-1.5 text-white px-5 py-2.5 rounded-[14px] font-semibold text-[15px] shadow-sm ml-4 shrink-0"
                        >
                            <Play className="w-4 h-4 fill-white" />
                            <span>{listenLink.label}</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
