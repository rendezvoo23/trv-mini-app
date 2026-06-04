import { createAdminClient } from '@/lib/supabase/admin';
import { VerifiedTelegramUser } from '@/lib/telegram/auth';

interface UpsertTelegramAccountInput {
    user: VerifiedTelegramUser;
    source: 'miniapp' | 'bot';
    chatId?: string | number | null;
    allowsBotMessages?: boolean;
}

function getDisplayName(user: VerifiedTelegramUser) {
    return [user.first_name, user.last_name].filter(Boolean).join(' ') ||
        user.username ||
        `Telegram ${user.id}`;
}

export async function upsertTelegramAccount({
    user,
    source,
    chatId,
    allowsBotMessages = false,
}: UpsertTelegramAccountInput) {
    const db = createAdminClient();
    const now = new Date().toISOString();

    const { data: existingAccount, error: lookupError } = await db
        .from('telegram_accounts')
        .select('id, user_id')
        .eq('telegram_user_id', user.id)
        .maybeSingle();

    if (lookupError) {
        throw lookupError;
    }

    let appUserId = existingAccount?.user_id;

    if (!appUserId) {
        const { data: createdUser, error: createUserError } = await db
            .from('app_users')
            .insert({
                status: 'active',
                display_name: getDisplayName(user),
                locale: user.language_code ?? null,
                last_seen_at: now,
            })
            .select('id')
            .single();

        if (createUserError) {
            throw createUserError;
        }

        appUserId = createdUser.id;
    } else {
        const { error: updateUserError } = await db
            .from('app_users')
            .update({
                display_name: getDisplayName(user),
                locale: user.language_code ?? null,
                last_seen_at: now,
            })
            .eq('id', appUserId);

        if (updateUserError) {
            throw updateUserError;
        }
    }

    const accountPayload = {
        user_id: appUserId,
        telegram_user_id: user.id,
        telegram_username: user.username ?? null,
        first_name: user.first_name ?? '',
        last_name: user.last_name ?? null,
        language_code: user.language_code ?? null,
        chat_id: chatId ? String(chatId) : null,
        is_bot_user: source === 'bot' || allowsBotMessages,
        allows_bot_messages: allowsBotMessages,
        last_seen_at: now,
        mini_app_last_seen_at: source === 'miniapp' ? now : undefined,
        bot_last_seen_at: source === 'bot' ? now : undefined,
    };

    const accountQuery = existingAccount
        ? db
              .from('telegram_accounts')
              .update(accountPayload)
              .eq('id', existingAccount.id)
        : db.from('telegram_accounts').insert(accountPayload);

    const { data: account, error: accountError } = await accountQuery
        .select('id, user_id, telegram_user_id, telegram_username, chat_id, allows_bot_messages')
        .single();

    if (accountError) {
        throw accountError;
    }

    if (allowsBotMessages) {
        const { error: subscriptionError } = await db
            .from('bot_subscriptions')
            .upsert(
                {
                    app_user_id: appUserId,
                    status: 'active',
                    allows_broadcasts: true,
                    subscribed_at: now,
                    unsubscribed_at: null,
                    last_interaction_at: now,
                },
                { onConflict: 'app_user_id' }
            );

        if (subscriptionError) {
            throw subscriptionError;
        }
    }

    const { data: roles, error: rolesError } = await db
        .from('app_user_roles')
        .select('role_key')
        .eq('user_id', appUserId);

    if (rolesError) {
        throw rolesError;
    }

    return {
        appUserId,
        account,
        roles: (roles ?? []).map((role) => role.role_key as string),
    };
}
