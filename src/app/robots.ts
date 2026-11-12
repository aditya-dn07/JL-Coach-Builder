import type { MetadataRoute } from 'next';
import { contentRepository } from '@/content/repository';
export default function robots(): MetadataRoute.Robots {
  return {
    rules: process.env.VERCEL_ENV === 'production'
      ? { userAgent: '*', allow: '/', disallow: '/api/' }
      : { userAgent: '*', disallow: '/' },
    sitemap: `${contentRepository.getSiteSettings().url}sitemap.xml`,
  };
}
