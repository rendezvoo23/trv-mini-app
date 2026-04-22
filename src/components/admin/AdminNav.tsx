'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
    { href: '/admin/artists', label: 'Artists' },
    { href: '/admin/releases', label: 'Releases' },
    { href: '/admin/events', label: 'Events' },
];

export function AdminNav() {
    const pathname = usePathname();

    return (
        <nav className="flex flex-wrap items-center gap-2">
            {navItems.map((item) => {
                const isActive =
                    pathname === item.href || pathname?.startsWith(`${item.href}/`);

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                            isActive
                                ? 'bg-black text-white'
                                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                        )}
                    >
                        {item.label}
                    </Link>
                );
            })}
        </nav>
    );
}
