import type { MetadataRoute } from 'next';
import { contentRepository } from '@/content/repository';
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return (await contentRepository.getPages()).map((page) => ({
    url: new URL(page.slug ? `/${page.slug}/` : '/', contentRepository.getSiteSettings().url).href,
    changeFrequency: 'monthly',
    priority: page.kind === 'home' ? 1 : page.kind === 'legal' ? 0.3 : 0.8,
  }));
}
