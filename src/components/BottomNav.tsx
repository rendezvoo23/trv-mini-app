'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

import { Disc, Users, ShoppingBag, Calendar } from 'lucide-react';

const tabs = [
    { label: 'Releases', href: '/releases', icon: Disc },
    { label: 'Artists', href: '/artists', icon: Users },
    { label: 'Merch', href: '/merch', icon: ShoppingBag },
    { label: 'Events', href: '/events', icon: Calendar },
];

export function BottomNav() {
    const pathname = usePathname();

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pointer-events-none" style={{ paddingBottom: 'calc(var(--safe-area-inset-bottom) + 16px)' }}>
            <nav
                className="mx-auto max-w-md w-full rounded-3xl bg-white/70 backdrop-blur-xl border border-white/40 shadow-[0_10px_40px_rgba(0,0,0,0.15)] pointer-events-auto"
            >
                <div className="flex items-center justify-around h-[68px]">
                    {tabs.map((tab) => {
                        const isActive =
                            pathname === tab.href || pathname.startsWith(tab.href + '/');
                        const Icon = tab.icon;
                        return (
                            <Link
                                key={tab.href}
                                href={tab.href}
                                className={cn(
                                    'flex flex-col items-center justify-center flex-1 h-full transition-all duration-300 active:scale-95 group',
                                    isActive
                                        ? 'text-trv-blue'
                                        : 'text-[#8A8A8E] hover:text-foreground'
                                )}
                            >
                                <Icon className={cn("w-[22px] h-[22px] mb-1 transition-transform group-hover:scale-110", isActive && "fill-trv-blue-50 stroke-trv-blue stroke-2")} strokeWidth={isActive ? 2 : 1.5} />
                                <span
                                    className={cn(
                                        'text-[10px] font-semibold tracking-wide transition-colors',
                                        isActive && 'font-bold'
                                    )}
                                >
                                    {tab.label}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
}
