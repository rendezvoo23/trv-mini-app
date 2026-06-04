-- Run this in Supabase SQL Editor after WEBAPP_URL and CRON_SECRET are configured.
-- Requires pg_cron and pg_net extensions.
-- Replace the placeholders before running. Prefer storing CRON_SECRET in Supabase Vault
-- for production instead of leaving it as a literal in SQL history.

create extension if not exists pg_cron with schema extensions;
create extension if not exists pg_net with schema extensions;

select cron.schedule(
    'trv-telegram-broadcast-test',
    '0 12 * * *',
    $$
    select net.http_post(
        url := 'https://YOUR_WEBAPP_DOMAIN/api/cron/telegram-broadcast',
        headers := jsonb_build_object(
            'Content-Type', 'application/json',
            'x-cron-secret', 'YOUR_CRON_SECRET'
        ),
        body := '{}'::jsonb
    );
    $$
);
