'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { isPublicSectionEnabled } from '@/domain/featureFlags';
import { cn } from '@/lib/utils';

const tabs = [
    { label: 'Релизы', href: '/releases', id: 'releases' },
    { label: 'Участники', href: '/artists', id: 'artists' },
    { label: 'Мерч', href: '/merch', id: 'merch' },
    { label: 'Мероприятия', href: '/events', id: 'events' },
] as const;

const visibleTabs = tabs.filter((tab) => isPublicSectionEnabled(tab.id));

export function BottomNav() {
    const pathname = usePathname();

    return (
        <div
            className="fixed bottom-0 left-0 right-0 z-50"
            style={{ paddingBottom: 'var(--safe-area-inset-bottom)' }}
        >
            <nav
                className="border-t border-black bg-[#f4f4f1]"
                style={{ fontFamily: 'Arial, sans-serif' }}
            >
                <div
                    className="grid h-[58px]"
                    style={{ gridTemplateColumns: `repeat(${visibleTabs.length}, minmax(0, 1fr))` }}
                >
                    {visibleTabs.map((tab, index) => {
                        const isActive =
                            pathname === tab.href || pathname.startsWith(tab.href + '/');

                        return (
                            <Link
                                key={tab.href}
                                href={tab.href}
                                className={cn(
                                    'flex items-center justify-center border-r border-black text-[14px] text-black active:bg-[#e9e9e6]',
                                    index === visibleTabs.length - 1 && 'border-r-0',
                                    isActive && 'font-bold'
                                )}
                            >
                                {tab.label}
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
}
