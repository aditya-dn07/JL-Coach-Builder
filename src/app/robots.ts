import type { MetadataRoute } from 'next';
import { site } from '@/data/site.data';
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: '/api/' },
    sitemap: `${site.url}sitemap.xml`,
  };
}
