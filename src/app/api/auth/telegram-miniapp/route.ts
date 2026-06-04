import { NextResponse } from 'next/server';
import { verifyTelegramInitData } from '@/lib/telegram/auth';
import { upsertTelegramAccount } from '@/lib/telegram/accounts';

export async function POST(request: Request) {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
        return NextResponse.json(
            { error: 'Telegram bot token is not configured.' },
            { status: 500 }
        );
    }

    const body = (await request.json().catch(() => null)) as {
        initData?: string;
    } | null;

    if (!body?.initData) {
        return NextResponse.json(
            { error: 'Telegram initData is required.' },
            { status: 400 }
        );
    }

    try {
        const verified = verifyTelegramInitData(body.initData, botToken);
        const result = await upsertTelegramAccount({
            user: verified.user,
            source: 'miniapp',
        });

        return NextResponse.json({
            user: {
                id: result.appUserId,
                telegramAccountId: result.account.id,
                telegramUserId: result.account.telegram_user_id,
                telegramUsername: result.account.telegram_username,
                roles: result.roles,
            },
            startParam: verified.startParam,
        });
    } catch {
        return NextResponse.json(
            { error: 'Telegram authorization failed.' },
            { status: 401 }
        );
    }
}
