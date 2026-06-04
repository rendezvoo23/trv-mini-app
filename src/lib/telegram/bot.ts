interface SendTelegramMessageInput {
    chatId: string | number;
    text: string;
    replyMarkup?: unknown;
}

function getTelegramBotToken() {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) {
        throw new Error('TELEGRAM_BOT_TOKEN is not configured.');
    }

    return token;
}

export function getTelegramMiniAppUrl(startParam = 'trv') {
    const webAppUrl = process.env.WEBAPP_URL;
    if (webAppUrl) {
        return webAppUrl;
    }

    const username = process.env.TELEGRAM_BOT_USERNAME?.replace(/^@/, '');
    return username
        ? `https://t.me/${username}?startapp=${encodeURIComponent(startParam)}`
        : null;
}

export function buildMiniAppReplyMarkup(startParam = 'trv') {
    const webAppUrl = getTelegramMiniAppUrl(startParam);

    return webAppUrl
        ? {
              inline_keyboard: [
                  [
                      webAppUrl.startsWith('https://t.me/')
                          ? { text: 'Открыть TRV', url: webAppUrl }
                          : { text: 'Открыть TRV', web_app: { url: webAppUrl } },
                  ],
              ],
          }
        : undefined;
}

export async function sendTelegramMessage({
    chatId,
    text,
    replyMarkup,
}: SendTelegramMessageInput) {
    const token = getTelegramBotToken();
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: chatId,
            text,
            parse_mode: 'HTML',
            disable_web_page_preview: true,
            reply_markup: replyMarkup,
        }),
    });

    const payload = await response.json();
    if (!response.ok || !payload.ok) {
        throw new Error(payload.description ?? 'Telegram sendMessage failed.');
    }

    return payload;
}
