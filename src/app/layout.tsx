import type { Metadata, Viewport } from 'next';
import { headingFont as display, bodyFont as body } from '@/lib/brand-fonts';
import { siteConfig } from '@/config/site';
import { Header, Footer } from '@/components/website/chrome';
import { MotionEffects } from '@/components/website/motion-effects';
import { InteractionEffects } from '@/components/website/interaction-effects';
import { pageMetadata } from '@/lib/metadata';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './website.css';
import './dark-theme.css';
import './ui-spacing.css';
import './brand-cleanup.css';
import './contact-panel.css';
import './trust-and-icons.css';
export const metadata: Metadata = {
  ...pageMetadata({
    title: 'Page not found',
    description:
      'Find your way to JL Coachbuilders vehicle services or contact our Christchurch workshop.',
    index: false,
  }),
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `Page not found | ${siteConfig.business.name}`,
    template: `%s | ${siteConfig.business.name}`,
  },
  alternates: { canonical: null },
  applicationName: siteConfig.business.name,
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '16x16 32x32 48x48' },
      { url: '/icons/icon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
};
export const viewport: Viewport = {
  themeColor: '#101317',
  width: 'device-width',
  initialScale: 1,
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={siteConfig.language} data-theme="dark">
      <body className={`${display.variable} ${body.variable} ui-polished`} id="top">
        <MotionEffects />
        <InteractionEffects />
        <Header />
        <main id="content" tabIndex={-1}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
