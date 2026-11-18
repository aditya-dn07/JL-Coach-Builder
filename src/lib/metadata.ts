import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import { pageUrl } from './site-url';
import { getSeoTarget } from './seo-targets';
import { productionIndexingEnabled } from './indexing';

export function pageMetadata({
  title,
  description,
  path = '/',
  index = true,
  settings = siteConfig,
  canonical,
  noindex = false,
  ogImage,
  type = 'website',
  publishedTime,
  routeOverride = true,
}: {
  title: string;
  description: string;
  path?: string;
  index?: boolean;
  settings?: typeof siteConfig;
  canonical?: string;
  noindex?: boolean;
  ogImage?: { src: string; alt: string; width?: number; height?: number };
  type?: 'website' | 'article';
  publishedTime?: string;
  routeOverride?: boolean;
}): Metadata {
  title = title.trim() || settings.seo.title;
  description = description.trim() || settings.seo.description;
  const siteConfig = settings;
  const brandSuffix = ` | ${siteConfig.business.name}`;
  index = index && !noindex;
  const cleanTitle = title.endsWith(brandSuffix) ? title.slice(0, -brandSuffix.length) : title;
  const fullTitle = `${cleanTitle}${brandSuffix}`;
  const target = routeOverride ? getSeoTarget(path) : undefined;
  const url = target?.canonical ?? (canonical ? new URL(canonical, siteConfig.url).href : pageUrl(path, siteConfig.url));
  const searchable = index && productionIndexingEnabled();
  const image = {
    url: new URL((ogImage ?? siteConfig.images.og).src, siteConfig.url).href,
    width: 1200,
    height: 630,
    alt: (ogImage ?? siteConfig.images.og).alt,
  };
  return {
    // All homepage URLs are absolute. Clearing the inherited base prevents
    // Next 15 from trimming the required '/' from its canonical and og:url.
    ...(target?.target_path === '/' ? { metadataBase: null } : {}),
    title: target ? { absolute: target.title } : path === '/' ? { absolute: fullTitle } : cleanTitle,
    description: target?.description ?? description,
    alternates: { canonical: url },
    robots: { index: searchable, follow: searchable, ...(searchable ? { 'max-image-preview': 'large' as const, 'max-snippet': -1, 'max-video-preview': -1 } : {}) },
    openGraph: {
      title: target?.og_title ?? fullTitle,
      description: target?.og_description ?? description,
      type,
      ...(type === 'article' && publishedTime ? { publishedTime } : {}),
      url: target?.og_url ?? url,
      siteName: siteConfig.business.name,
      locale: siteConfig.locale,
      images: [image],
    },
    twitter: { card: 'summary_large_image', title: target?.twitter_title ?? fullTitle, description: target?.twitter_description ?? description, images: [image.url] },
  };
}
