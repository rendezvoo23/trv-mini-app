import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
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

    const db = createAdminClient();
    const { data: accounts, error } = await db
        .from('telegram_accounts')
        .select('id, chat_id')
        .eq('allows_bot_messages', true)
        .not('chat_id', 'is', null)
        .limit(20);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const results = await Promise.allSettled(
        (accounts ?? []).map((account) =>
            sendTelegramMessage({
                chatId: account.chat_id,
                text: 'TRV cron test: регулярные сообщения бота готовы к настройке.',
                replyMarkup: buildMiniAppReplyMarkup('trv'),
            })
        )
    );

    return NextResponse.json({
        ok: true,
        attempted: results.length,
        sent: results.filter((result) => result.status === 'fulfilled').length,
        failed: results.filter((result) => result.status === 'rejected').length,
    });
}
