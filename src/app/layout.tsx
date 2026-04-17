import type { Metadata, Viewport } from 'next';
import { BottomNav } from '@/components/BottomNav';
import { QueryProvider } from '@/components/QueryProvider';
import { TelegramProvider } from '@/components/TelegramProvider';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: 'TRV — Music Label',
  description: 'TRV — российский музыкальный лейбл. Релизы, артисты, мерч, события.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <head>
        <script src="https://telegram.org/js/telegram-web-app.js" defer />
      </head>
      <body>
        <QueryProvider>
          <TelegramProvider>
            <div className="fixed inset-0 z-[-1] bg-gradient-to-b from-[#2855FF]/90 via-white to-white pointer-events-none" />
            <main className="pb-24 min-h-screen relative">{children}</main>
            <BottomNav />
          </TelegramProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
