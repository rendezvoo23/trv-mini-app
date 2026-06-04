import crypto from 'crypto';

export interface VerifiedTelegramUser {
    id: string;
    username?: string;
    first_name?: string;
    last_name?: string;
    language_code?: string;
    is_premium?: boolean;
}

export interface VerifiedTelegramInitData {
    user: VerifiedTelegramUser;
    startParam: string | null;
    authDate: Date;
}

function timingSafeHexEqual(left: string, right: string) {
    const leftBuffer = Buffer.from(left, 'hex');
    const rightBuffer = Buffer.from(right, 'hex');

    return (
        leftBuffer.length === rightBuffer.length &&
        crypto.timingSafeEqual(leftBuffer, rightBuffer)
    );
}

export function verifyTelegramInitData(
    initData: string,
    botToken: string,
    maxAgeSeconds = 24 * 60 * 60
): VerifiedTelegramInitData {
    const params = new URLSearchParams(initData);
    const receivedHash = params.get('hash');
    const rawUser = params.get('user');
    const authDateValue = params.get('auth_date');

    if (!receivedHash || !rawUser || !authDateValue) {
        throw new Error('Telegram initData is incomplete.');
    }

    const dataCheckString = Array.from(params.entries())
        .filter(([key]) => key !== 'hash')
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, value]) => `${key}=${value}`)
        .join('\n');

    const secretKey = crypto
        .createHmac('sha256', 'WebAppData')
        .update(botToken)
        .digest();
    const calculatedHash = crypto
        .createHmac('sha256', secretKey)
        .update(dataCheckString)
        .digest('hex');

    if (!timingSafeHexEqual(calculatedHash, receivedHash)) {
        throw new Error('Telegram initData signature is invalid.');
    }

    const authTimestamp = Number(authDateValue);
    if (!Number.isFinite(authTimestamp)) {
        throw new Error('Telegram auth_date is invalid.');
    }

    const authDate = new Date(authTimestamp * 1000);
    const ageSeconds = Math.floor((Date.now() - authDate.getTime()) / 1000);
    if (ageSeconds < 0 || ageSeconds > maxAgeSeconds) {
        throw new Error('Telegram initData is expired.');
    }

    const user = JSON.parse(rawUser) as VerifiedTelegramUser;
    if (!user?.id) {
        throw new Error('Telegram user is missing.');
    }

    return {
        user: {
            ...user,
            id: String(user.id),
        },
        startParam: params.get('start_param'),
        authDate,
    };
}
