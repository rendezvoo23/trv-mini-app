import type { Metadata, Viewport } from 'next';
import { RootShell } from '@/components/RootShell';
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
        <RootShell>{children}</RootShell>
      </body>
    </html>
  );
}
