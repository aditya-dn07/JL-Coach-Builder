import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';
const brandSuffix = ` | ${siteConfig.business.name}`;
export function pageMetadata({
  title,
  description,
  path = '/',
  index = true,
}: {
  title: string;
  description: string;
  path?: string;
  index?: boolean;
}): Metadata {
  const cleanTitle = title.endsWith(brandSuffix) ? title.slice(0, -brandSuffix.length) : title;
  const fullTitle = `${cleanTitle}${brandSuffix}`;
  const url = new URL(path, siteConfig.url).href;
  const image = {
    url: new URL(siteConfig.images.og.src, siteConfig.url).href,
    width: 1200,
    height: 630,
    alt: siteConfig.images.og.alt,
  };
  return {
    title: path === '/' ? { absolute: fullTitle } : cleanTitle,
    description,
    alternates: { canonical: url },
    robots: { index: index && process.env.VERCEL_ENV === 'production', follow: index && process.env.VERCEL_ENV === 'production' },
    openGraph: {
      title: fullTitle,
      description,
      type: 'website',
      url,
      siteName: siteConfig.business.name,
      locale: siteConfig.locale,
      images: [image],
    },
    twitter: { card: 'summary_large_image', title: fullTitle, description, images: [image.url] },
  };
}
