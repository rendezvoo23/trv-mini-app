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
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-1 px-4">
            {options.map((option) => (
                <button
                    key={option}
                    onClick={() => onSelect(option)}
                    className={cn(
                        'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200',
                        option === activeOption
                            ? 'bg-trv-blue text-white shadow-sm'
                            : 'bg-trv-blue-50 text-trv-blue-dark hover:bg-trv-blue-100'
                    )}
                >
                    {option}
                </button>
            ))}
        </div>
    );
}
