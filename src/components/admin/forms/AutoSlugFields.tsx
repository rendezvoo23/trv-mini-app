'use client';

import { useEffect, useState } from 'react';
import { FieldError } from '@/components/admin/forms/FieldError';
import { Input } from '@/components/ui/input';
import { slugify } from '@/lib/admin/validation';

interface AutoSlugFieldsProps {
    sourceFieldId: string;
    sourceFieldName: string;
    sourceFieldLabel: string;
    sourceInitialValue: string;
    sourceError?: string;
    slugFieldId: string;
    slugFieldName: string;
    slugFieldLabel: string;
    slugInitialValue: string;
    slugError?: string;
    isEditing: boolean;
}

export function AutoSlugFields({
    sourceFieldId,
    sourceFieldName,
    sourceFieldLabel,
    sourceInitialValue,
    sourceError,
    slugFieldId,
    slugFieldName,
    slugFieldLabel,
    slugInitialValue,
    slugError,
    isEditing,
}: AutoSlugFieldsProps) {
    const [sourceValue, setSourceValue] = useState(sourceInitialValue);
    const [slugValue, setSlugValue] = useState(slugInitialValue);
    const [slugTouched, setSlugTouched] = useState(isEditing);

    useEffect(() => {
        if (!slugTouched) {
            setSlugValue(slugify(sourceValue));
        }
    }, [sourceValue, slugTouched]);

    return (
        <>
            <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-slate-900" htmlFor={sourceFieldId}>
                    {sourceFieldLabel}
                </label>
                <Input
                    id={sourceFieldId}
                    name={sourceFieldName}
                    value={sourceValue}
                    onChange={(event) => setSourceValue(event.target.value)}
                />
                <FieldError message={sourceError} />
            </div>
            <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-slate-900" htmlFor={slugFieldId}>
                    {slugFieldLabel}
                </label>
                <Input
                    id={slugFieldId}
                    name={slugFieldName}
                    value={slugValue}
                    onChange={(event) => {
                        setSlugTouched(true);
                        setSlugValue(event.target.value);
                    }}
                />
                <FieldError message={slugError} />
            </div>
        </>
    );
}
