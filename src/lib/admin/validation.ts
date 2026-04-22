import { AdminActionState } from '@/lib/admin/auth';

export function slugify(value: string) {
    return value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\u0400-\u04ff]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

const CYRILLIC_TO_LATIN_MAP: Record<string, string> = {
    а: 'a',
    б: 'b',
    в: 'v',
    г: 'g',
    д: 'd',
    е: 'e',
    ё: 'e',
    ж: 'zh',
    з: 'z',
    и: 'i',
    й: 'y',
    к: 'k',
    л: 'l',
    м: 'm',
    н: 'n',
    о: 'o',
    п: 'p',
    р: 'r',
    с: 's',
    т: 't',
    у: 'u',
    ф: 'f',
    х: 'h',
    ц: 'ts',
    ч: 'ch',
    ш: 'sh',
    щ: 'sch',
    ъ: '',
    ы: 'y',
    ь: '',
    э: 'e',
    ю: 'yu',
    я: 'ya',
};

export function toStorageKeySegment(value: string) {
    const transliterated = value
        .trim()
        .toLowerCase()
        .split('')
        .map((character) => CYRILLIC_TO_LATIN_MAP[character] ?? character)
        .join('');

    return transliterated
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

export function getOptionalString(value: FormDataEntryValue | null) {
    if (typeof value !== 'string') {
        return null;
    }

    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
}

export function getRequiredString(
    value: FormDataEntryValue | null,
    fieldName: string,
    fieldErrors: Record<string, string>
) {
    const normalized = getOptionalString(value);
    if (!normalized) {
        fieldErrors[fieldName] = 'This field is required.';
        return '';
    }

    return normalized;
}

export function getNumberValue(
    value: FormDataEntryValue | null,
    fallback = 0
) {
    if (typeof value !== 'string' || value.trim().length === 0) {
        return fallback;
    }

    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
}

export function parseJsonField<T>(
    value: FormDataEntryValue | null,
    fallback: T
) {
    if (typeof value !== 'string' || value.trim().length === 0) {
        return fallback;
    }

    try {
        return JSON.parse(value) as T;
    } catch {
        return fallback;
    }
}

export function isValidUrl(value: string) {
    try {
        new URL(value);
        return true;
    } catch {
        return false;
    }
}

export function withFieldError(
    state: AdminActionState,
    fieldName: string,
    message: string
) {
    return {
        ...state,
        success: false,
        fieldErrors: {
            ...(state.fieldErrors ?? {}),
            [fieldName]: message,
        },
    };
}
