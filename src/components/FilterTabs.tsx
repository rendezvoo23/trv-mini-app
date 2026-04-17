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
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-2 px-5">
            {options.map((option) => (
                <button
                    key={option}
                    onClick={() => onSelect(option)}
                    className={cn(
                        'px-[18px] py-[7px] rounded-full text-[14px] font-medium whitespace-nowrap transition-all duration-300',
                        option === activeOption
                            ? 'bg-white text-foreground shadow-[0_2px_8px_rgba(0,0,0,0.06)] scale-105'
                            : 'bg-[#B1C3FF]/50 text-trv-blue-dark/80 hover:bg-[#B1C3FF]/70 backdrop-blur-md mix-blend-color-burn'
                    )}
                >
                    {option}
                </button>
            ))}
        </div>
    );
}
