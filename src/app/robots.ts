import type { MetadataRoute } from 'next';
import { contentRepository } from '@/content/repository';
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: '/api/' },
    sitemap: `${contentRepository.getSiteSettings().url}sitemap.xml`,
  };
}
