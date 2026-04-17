'use client';

import { useMerch } from '@/lib/hooks/useMerch';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { openExternalLink } from '@/lib/telegram';
import { useState } from 'react';

export default function MerchDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { data: item, isLoading } = useMerch(params.id as string);
    const [activeImage, setActiveImage] = useState(0);

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

    if (!item) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <p className="text-muted-foreground">Item not found</p>
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

            {/* Image Gallery */}
            <div className="px-4">
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted mb-3">
                    {item.gallery[activeImage] && (
                        <Image
                            src={item.gallery[activeImage].url}
                            alt={item.gallery[activeImage].alt}
                            fill
                            sizes="(max-width: 768px) 100vw, 600px"
                            className="object-cover transition-opacity duration-300"
                            priority
                        />
                    )}
                    {!item.isAvailable && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <span className="text-white text-lg font-bold tracking-widest uppercase">
                                Sold Out
                            </span>
                        </div>
                    )}
                </div>

                {/* Image thumbnails */}
                {item.gallery.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto no-scrollbar">
                        {item.gallery.map((image, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveImage(i)}
                                className={`relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 ring-2 transition-all ${i === activeImage
                                        ? 'ring-trv-blue'
                                        : 'ring-transparent opacity-60'
                                    }`}
                            >
                                <Image
                                    src={image.url}
                                    alt={image.alt}
                                    fill
                                    sizes="64px"
                                    className="object-cover"
                                    loading="lazy"
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="px-4 py-5 space-y-4">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">
                        {item.artist?.name ?? 'TRV'}
                    </p>
                    <h1 className="text-2xl font-black tracking-tight text-foreground mt-1">
                        {item.name}
                    </h1>
                    <div className="flex items-center gap-2 mt-2">
                        <Badge className="bg-trv-blue text-white text-xs font-bold px-3 py-1">
                            {item.categoryLabel}
                        </Badge>
                        {!item.isAvailable && (
                            <Badge variant="secondary" className="text-xs font-semibold text-destructive">
                                Sold Out
                            </Badge>
                        )}
                    </div>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                </p>

                <div className="bg-muted/50 rounded-xl p-3 space-y-1">
                    <p className="text-xs font-semibold text-foreground uppercase tracking-wider">
                        Composition
                    </p>
                    <p className="text-sm text-muted-foreground">{item.composition}</p>
                </div>

                <p className="text-xs text-muted-foreground">
                    Released{' '}
                    {new Date(item.releaseDate).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                    })}
                </p>

                <Button
                    className="w-full bg-trv-blue hover:bg-trv-blue-dark text-white font-bold rounded-xl h-12 text-base disabled:opacity-50"
                    disabled={!item.isAvailable || !item.purchaseLink}
                    onClick={() => item.purchaseLink && openExternalLink(item.purchaseLink.url)}
                >
                    {item.isAvailable ? item.purchaseLink?.label ?? 'Buy' : 'Sold Out'}
                </Button>
            </div>
        </div>
    );
}
