import { NextResponse } from 'next/server';
import { upsertTelegramAccount } from '@/lib/telegram/accounts';
import {
    buildMiniAppReplyMarkup,
    sendTelegramMessage,
} from '@/lib/telegram/bot';

interface TelegramWebhookUpdate {
    message?: {
        text?: string;
        chat: {
            id: number | string;
        };
        from?: {
            id: number | string;
            username?: string;
            first_name?: string;
            last_name?: string;
            language_code?: string;
        };
    };
}

function isAuthorizedWebhook(request: Request) {
    const expectedSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
    if (!expectedSecret) {
        return false;
    }

    return (
        request.headers.get('x-telegram-bot-api-secret-token') === expectedSecret
    );
}

export async function POST(request: Request) {
    if (!isAuthorizedWebhook(request)) {
        return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const update = (await request.json().catch(() => null)) as
        | TelegramWebhookUpdate
        | null;
    const message = update?.message;
    const from = message?.from;

    if (!message || !from) {
        return NextResponse.json({ ok: true });
    }

    await upsertTelegramAccount({
        user: {
            id: String(from.id),
            username: from.username,
            first_name: from.first_name,
            last_name: from.last_name,
            language_code: from.language_code,
        },
        source: 'bot',
        chatId: message.chat.id,
        allowsBotMessages: true,
    });

    if (message.text?.startsWith('/start')) {
        await sendTelegramMessage({
            chatId: message.chat.id,
            text:
                'Привет! Это TRV. Я смогу отправлять тебе новости лейбла, релизы и анонсы мероприятий.',
            replyMarkup: buildMiniAppReplyMarkup('trv'),
        });
    }

    return NextResponse.json({ ok: true });
}
