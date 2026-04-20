import { getSupabaseConfig } from '@/lib/supabase/config';

function stripLeadingSlashes(value: string) {
    return value.replace(/^\/+/, '');
}

function stripStoragePrefix(pathname: string, bucket: string) {
    const normalizedBucket = stripLeadingSlashes(bucket.trim());
    const prefixes = [
        `storage/v1/object/public/${normalizedBucket}/`,
        `storage/v1/object/sign/${normalizedBucket}/`,
        `object/public/${normalizedBucket}/`,
        `object/sign/${normalizedBucket}/`,
        `public/${normalizedBucket}/`,
        `${normalizedBucket}/`,
    ];

    for (const prefix of prefixes) {
        if (pathname.startsWith(prefix)) {
            return pathname.slice(prefix.length);
        }
    }

    return pathname;
}

function decodePathSegments(pathname: string) {
    return pathname
        .split('/')
        .filter(Boolean)
        .map((segment) => {
            try {
                return decodeURIComponent(segment);
            } catch {
                return segment;
            }
        })
        .join('/');
}

function encodePathSegments(pathname: string) {
    return pathname
        .split('/')
        .filter(Boolean)
        .map((segment) => encodeURIComponent(segment))
        .join('/');
}

export function normalizeStoragePath(storagePath: string, bucket: string) {
    const trimmedPath = storagePath.trim();
    if (!trimmedPath) {
        return null;
    }

    const normalizedBucket = stripLeadingSlashes(bucket.trim());
    let normalizedPath = trimmedPath;

    try {
        const parsedUrl = new URL(trimmedPath);
        normalizedPath = parsedUrl.pathname;
    } catch {
        normalizedPath = trimmedPath;
    }

    normalizedPath = normalizedPath.replace(/\\/g, '/');
    normalizedPath = stripLeadingSlashes(normalizedPath);
    normalizedPath = stripStoragePrefix(normalizedPath, normalizedBucket);
    normalizedPath = decodePathSegments(normalizedPath);

    return normalizedPath.length > 0 ? normalizedPath : null;
}

export function getSupabaseStoragePublicUrl(
    bucket: string | null | undefined,
    storagePath: string | null | undefined
) {
    if (!bucket || !storagePath) {
        return null;
    }

    const normalizedBucket = stripLeadingSlashes(bucket.trim());
    const normalizedPath = normalizeStoragePath(storagePath, normalizedBucket);
    if (!normalizedBucket || !normalizedPath) {
        return null;
    }

    const encodedPath = encodePathSegments(normalizedPath);
    const { url } = getSupabaseConfig();
    return new URL(
        `/storage/v1/object/public/${normalizedBucket}/${encodedPath}`,
        url
    ).toString();
}
