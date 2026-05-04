'use client';

import { cn } from '@/lib/utils';

interface FilterTabsProps<T extends string> {
    options: T[];
    activeOption: T;
    onSelect: (option: T) => void;
}

export function FilterTabs<T extends string>({
    options,
    activeOption,
    onSelect,
}: FilterTabsProps<T>) {
    return (
        <div
            className="flex gap-2 overflow-x-auto no-scrollbar px-6 py-2"
            style={{ fontFamily: 'Arial, sans-serif' }}
        >
            {options.map((option) => (
                <button
                    key={option}
                    onClick={() => onSelect(option)}
                    className={cn(
                        'border border-black px-4 py-2 text-[14px] whitespace-nowrap text-black transition-colors',
                        option === activeOption
                            ? 'bg-black text-white'
                            : 'bg-white active:bg-[#ececec]'
                    )}
                >
                    {option}
                </button>
            ))}
        </div>
    );
}
