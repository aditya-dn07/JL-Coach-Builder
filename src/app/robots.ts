import type { MetadataRoute } from 'next';
import { getPublicContent } from '../lib/sanity/public-content';
export default async function robots(): Promise<MetadataRoute.Robots> {
  const { siteSettings, editorial } = await getPublicContent();
  return {
    rules: process.env.VERCEL_ENV === 'production'
      ? { userAgent: '*', allow: editorial.sitemap.robotsAllow, disallow: editorial.sitemap.robotsDisallow }
      : { userAgent: '*', disallow: '/' },
    sitemap: new URL('sitemap.xml', siteSettings.url).href,
  };
}
