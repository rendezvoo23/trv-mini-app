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

function ShapeIcon({ id, isActive }: { id: string; isActive: boolean }) {
    const colorClass = isActive ? 'fill-[#007AFF]' : 'fill-[#1C1C1E]'; // Apple Blue vs Dark

    switch (id) {
        case 'releases':
            // Diamond
            return (
                <svg width="22" height="22" viewBox="0 0 24 24" className={cn("transition-colors duration-300", colorClass)}>
                    <path d="M12 2L22 12L12 22L2 12L12 2Z" />
                </svg>
            );
        case 'artists':
            // Circle
            return (
                <svg width="22" height="22" viewBox="0 0 24 24" className={cn("transition-colors duration-300", colorClass)}>
                    <circle cx="12" cy="12" r="10" />
                </svg>
            );
        case 'merch':
            // Triangle
            return (
                <svg width="22" height="22" viewBox="0 0 24 24" className={cn("transition-colors duration-300", colorClass)}>
                    <path d="M12 2L22 20H2L12 2Z" />
                </svg>
            );
        case 'events':
            // Decagon / Starburst
            return (
                <svg width="22" height="22" viewBox="0 0 24 24" className={cn("transition-colors duration-300", colorClass)}>
                    <path d="M12 1L15.3 4.3L20 4.5L20.2 9.2L23.5 12.5L20.2 15.8L20 20.5L15.3 20.7L12 24L8.7 20.7L4 20.5L3.8 15.8L0.5 12.5L3.8 9.2L4 4.5L8.7 4.3L12 1Z" />
                </svg>
            );
        default:
            return null;
    }
}

export function BottomNav() {
    const pathname = usePathname();

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none flex justify-center" style={{ paddingBottom: 'calc(var(--safe-area-inset-bottom) + 20px)' }}>
            <nav
                className="w-[calc(100%-48px)] max-w-[340px] rounded-[32px] pointer-events-auto relative overflow-hidden"
                style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.45)', // Core bright layer 
                    backdropFilter: 'blur(35px) saturate(220%)',
                    WebkitBackdropFilter: 'blur(35px) saturate(220%)', // Essential for Safari native liquid glass
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08), inset 0 0 0 1px rgba(255, 255, 255, 0.55)',
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />
                <div className="flex items-center justify-around h-[66px] relative z-10 w-full px-2">
                    {visibleTabs.map((tab) => {
                        const isActive =
                            pathname === tab.href || pathname.startsWith(tab.href + '/');

                        return (
                            <Link
                                key={tab.href}
                                href={tab.href}
                                className={cn(
                                    'flex flex-col items-center justify-center flex-1 h-full transition-all duration-300 active:scale-90 group'
                                )}
                            >
                                <div className={cn("mb-1 transition-transform duration-300 group-hover:scale-110", isActive && "scale-105")}>
                                    <ShapeIcon id={tab.id} isActive={isActive} />
                                </div>
                                <span
                                    className={cn(
                                        'text-[10px] font-semibold tracking-wide transition-colors',
                                        isActive ? 'text-[#007AFF]' : 'text-[#1C1C1E]'
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
