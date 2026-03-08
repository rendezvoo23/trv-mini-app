'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const tabs = [
    { label: 'Releases', href: '/releases' },
    { label: 'Artists', href: '/artists' },
    { label: 'Merch', href: '/merch' },
    { label: 'Events', href: '/events' },
];

export function BottomNav() {
    const pathname = usePathname();

    return (
        <nav
            className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-border"
            style={{ paddingBottom: 'var(--safe-area-inset-bottom)' }}
        >
            <div className="flex items-center justify-around h-14">
                {tabs.map((tab) => {
                    const isActive =
                        pathname === tab.href || pathname.startsWith(tab.href + '/');
                    return (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            className={cn(
                                'flex flex-col items-center justify-center flex-1 h-full transition-colors duration-200',
                                isActive
                                    ? 'text-trv-blue'
                                    : 'text-muted-foreground hover:text-foreground'
                            )}
                        >
                            <span
                                className={cn(
                                    'text-xs font-semibold tracking-wide',
                                    isActive && 'font-bold'
                                )}
                            >
                                {tab.label}
                            </span>
                            {isActive && (
                                <span className="w-1 h-1 mt-1 rounded-full bg-trv-blue" />
                            )}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
