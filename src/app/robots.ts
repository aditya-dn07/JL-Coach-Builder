import type { MetadataRoute } from 'next';
import { getPublicContent } from '../lib/sanity/public-content';
import { PRODUCTION_ORIGIN } from '../lib/seo-targets';
export default async function robots(): Promise<MetadataRoute.Robots> {
  const { editorial } = await getPublicContent();
  return {
    // Preview pages must be crawlable so their noindex meta/header can be read.
    rules: { userAgent: '*', allow: '/', disallow: editorial.sitemap.robotsDisallow.filter(path => path !== '/' && path !== '/*') },
    sitemap: new URL('/sitemap.xml', PRODUCTION_ORIGIN).href,
  };
}
