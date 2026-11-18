import type { Metadata, Viewport } from 'next';
import { getPublicContent } from '@/lib/sanity/public-content';
import { SiteContentProvider } from '@/components/providers/site-content';
import { Header } from '@/components/layout/site-header';
import { Footer } from '@/components/layout/site-footer';
import { BackToTop } from '@/components/layout/back-to-top';
import { MobileActionBar } from '@/components/layout/mobile-action-bar';
import { ClosingContact } from '@/components/contact/closing-contact';
import { MotionEffects } from '@/components/layout/motion-effects';
import { InteractionEffects } from '@/components/layout/interaction-effects';
import { pageMetadata } from '@/lib/metadata';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '@/styles/globals.css';
import '@/components/shared/sections.css';
import '@/styles/theme.css';
import '@/styles/refinements.css';
import '@/components/contact/contact-panel.css';
import '@/components/shared/icons.css';
export async function generateMetadata(): Promise<Metadata> {
 const { siteSettings: siteConfig, editorial } = await getPublicContent();
 return {
  ...pageMetadata({
    title: editorial.interface.recovery.notFoundMetaTitle,
    settings: siteConfig,
    description: editorial.interface.recovery.notFoundMetaDescription,
    index: false,
  }),
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${editorial.interface.recovery.notFoundMetaTitle} | ${siteConfig.business.name}`,
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
}
export async function generateViewport(): Promise<Viewport> {
 const { siteSettings } = await getPublicContent();
 return {
  themeColor: siteSettings.ui.viewportThemeColor || '#101317',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};
}
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const snapshot = await getPublicContent();
  return (
        <SiteContentProvider value={snapshot}>
        <MotionEffects />
        <InteractionEffects />
        <Header />
        <main id="content" tabIndex={-1}>
          {children}
        </main>
        <ClosingContact />
        <Footer />
        <BackToTop />
        <MobileActionBar />
        </SiteContentProvider>
  );
}
