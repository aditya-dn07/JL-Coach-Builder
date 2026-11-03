'use client';
import localFont from 'next/font/local';
import { RetryPanel } from '@/components/errors/retry-panel';
import { siteConfig } from '@/config/site';
import './website.css';
import './dark-theme.css';
import './brand-cleanup.css';
const display = localFont({
  src: '../../public/fonts/outfit-medium.ttf',
  weight: '500',
  variable: '--font-display',
  display: 'swap',
});
const body = localFont({
  src: '../../public/fonts/inter-latin.woff2',
  weight: '100 900',
  variable: '--font-body',
  display: 'swap',
});
export default function GlobalError() {
  return (
    <html lang={siteConfig.language} data-theme="dark">
      <head>
        <title>Page unavailable | {siteConfig.business.name}</title>
        <meta name="robots" content="noindex,nofollow" />
      </head>
      <body className={`${display.variable} ${body.variable}`}>
        <main>
          <RetryPanel retry={() => window.location.reload()} global />
        </main>
      </body>
    </html>
  );
}
