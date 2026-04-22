'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

interface AdminImageUploadFieldProps {
    label: string;
    inputName: string;
    bucket: 'artists' | 'releases' | 'events';
    altTextInputId?: string;
    folderHintInputId?: string;
    altTextFallback?: string;
    folderHintFallback?: string;
    initialAssetId?: string | null;
    initialPreviewUrl?: string | null;
    initialPreviewAlt?: string | null;
}

export function AdminImageUploadField({
    label,
    inputName,
    bucket,
    altTextInputId,
    folderHintInputId,
    altTextFallback = '',
    folderHintFallback = '',
    initialAssetId = null,
    initialPreviewUrl = null,
    initialPreviewAlt = null,
}: AdminImageUploadFieldProps) {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [assetId, setAssetId] = useState<string | null>(initialAssetId);
    const [previewUrl, setPreviewUrl] = useState<string | null>(initialPreviewUrl);
    const [previewAlt, setPreviewAlt] = useState(initialPreviewAlt ?? '');
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    function getCurrentInputValue(inputId: string | undefined, fallback: string) {
        if (!inputId) {
            return fallback;
        }

        const input = document.getElementById(inputId);
        if (!input || !('value' in input) || typeof input.value !== 'string') {
            return fallback;
        }

        return input.value;
    }

    async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }

        setIsUploading(true);
        setError(null);

        try {
            const altText = getCurrentInputValue(altTextInputId, altTextFallback);
            const folderHint = getCurrentInputValue(
                folderHintInputId,
                folderHintFallback
            );
            const formData = new FormData();
            formData.append('file', file);
            formData.append('bucket', bucket);
            formData.append('folder_hint', folderHint);
            formData.append('alt_text', altText);

            const response = await fetch('/api/admin/media', {
                method: 'POST',
                body: formData,
            });

            const payload = (await response.json().catch(() => null)) as
                | {
                      asset?: { id: string; url: string; alt: string };
                      error?: string;
                  }
                | null;
            if (!response.ok) {
                throw new Error(payload?.error ?? 'Upload failed.');
            }

            if (!payload?.asset) {
                throw new Error('Upload response is missing asset data.');
            }

            setAssetId(payload.asset.id);
            setPreviewUrl(payload.asset.url);
            setPreviewAlt(payload.asset.alt);
        } catch (uploadError) {
            setError(
                uploadError instanceof Error
                    ? uploadError.message
                    : 'Upload failed.'
            );
        } finally {
            setIsUploading(false);
            if (inputRef.current) {
                inputRef.current.value = '';
            }
        }
    }

    function handleRemove() {
        setAssetId(null);
        setPreviewUrl(null);
        setPreviewAlt('');
        setError(null);
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    }

    return (
        <div className="space-y-3">
            <input type="hidden" name={inputName} value={assetId ?? ''} />
            <div>
                <p className="text-sm font-medium text-slate-900">{label}</p>
                <p className="text-xs text-slate-500">
                    Upload image, preview it, replace it, or remove it.
                </p>
            </div>
            {previewUrl ? (
                <div className="relative h-40 w-40 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                    <Image
                        src={previewUrl}
                        alt={previewAlt || altTextFallback || label}
                        fill
                        sizes="160px"
                        className="object-cover"
                    />
                </div>
            ) : (
                <div className="flex h-40 w-40 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-400">
                    No image
                </div>
            )}
            <div className="flex flex-wrap gap-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => inputRef.current?.click()}
                    disabled={isUploading}
                >
                    {isUploading ? 'Uploading...' : previewUrl ? 'Replace image' : 'Upload image'}
                </Button>
                {previewUrl ? (
                    <Button type="button" variant="ghost" onClick={handleRemove}>
                        Remove image
                    </Button>
                ) : null}
            </div>
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
            />
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
        </div>
    );
}
