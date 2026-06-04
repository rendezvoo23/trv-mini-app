import { NextResponse } from 'next/server';
import {
    buildMiniAppReplyMarkup,
    sendTelegramMessage,
} from '@/lib/telegram/bot';

function isAuthorized(request: Request) {
    const expectedSecret = process.env.CRON_SECRET;
    if (!expectedSecret) {
        return false;
    }

    const headerSecret =
        request.headers.get('x-cron-secret') ??
        request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');

    return headerSecret === expectedSecret;
}

export async function POST(request: Request) {
    if (!isAuthorized(request)) {
        return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = (await request.json().catch(() => null)) as {
        chatId?: string | number;
        text?: string;
    } | null;

    if (!body?.chatId) {
        return NextResponse.json(
            { error: 'chatId is required.' },
            { status: 400 }
        );
    }

    const result = await sendTelegramMessage({
        chatId: body.chatId,
        text: body.text ?? 'TRV test message: бот подключен и готов к работе.',
        replyMarkup: buildMiniAppReplyMarkup('trv'),
    });

    return NextResponse.json({ ok: true, result });
}
