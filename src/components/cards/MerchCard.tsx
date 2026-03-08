'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { MerchItemWithArtist } from '@/types';

interface MerchCardProps {
    item: MerchItemWithArtist;
}

export function MerchCard({ item }: MerchCardProps) {
    return (
        <Link
            href={`/merch/${item.id}`}
            className="block group animate-fade-in"
        >
            <div className="relative aspect-square rounded-xl overflow-hidden mb-2 bg-muted">
                <Image
                    src={item.image_urls[0]}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 300px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                />
                {!item.available && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="text-white text-xs font-bold tracking-widest uppercase">
                            Sold Out
                        </span>
                    </div>
                )}
            </div>
            <div className="space-y-0.5 px-0.5">
                <p className="text-xs text-muted-foreground font-medium">
                    {item.artist.name}
                </p>
                <h3 className="text-sm font-bold text-foreground tracking-tight leading-tight">
                    {item.name}
                </h3>
                <div className="flex items-center gap-2">
                    <Badge
                        variant="secondary"
                        className="text-[10px] bg-trv-blue-50 text-trv-blue-dark font-semibold"
                    >
                        {item.type}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground">
                        {new Date(item.release_date).toLocaleDateString('ru-RU', {
                            day: 'numeric',
                            month: 'short',
                        })}
                    </span>
                </div>
            </div>
        </Link>
    );
}
