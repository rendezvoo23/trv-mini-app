import type { Metadata, Viewport } from 'next';
import { Header } from '@/components/Header';
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
            <Header />
            <main className="pt-14 pb-16 min-h-screen">{children}</main>
            <BottomNav />
          </TelegramProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
