'use client';

import Image from 'next/image';
import Link from 'next/link';

export function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
            <div
                className="flex items-center justify-center h-14"
                style={{ paddingTop: 'var(--safe-area-inset-top)' }}
            >
                <Link href="/releases" className="flex items-center justify-center hover:opacity-80 transition-opacity">
                    <Image
                        src="/trv-logo.svg"
                        alt="TRV"
                        width={113}
                        height={24}
                        priority
                    />
                </Link>
            </div>
        </header>
    );
}
