import { headingFont as display, bodyFont as body } from '@/lib/brand-fonts';
import { getPublicContent } from '@/lib/sanity/public-content';
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { siteSettings } = await getPublicContent();
  return <html lang={siteSettings.language} data-theme="dark">
    <body className={`${display.variable} ${body.variable} ui-polished`} id="top">{children}</body>
  </html>;
}
