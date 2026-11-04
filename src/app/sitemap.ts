import type { MetadataRoute } from 'next';
import { contentRepository } from '@/content/repository';
import { site } from '@/data/site.data';
import { resourcePages } from '@/content/resource-pages';
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [...(await contentRepository.getPages()), ...resourcePages].map((page) => ({
    url: new URL(page.slug ? `/${page.slug}/` : '/', site.url).href,
    changeFrequency: 'monthly',
    priority: page.kind === 'home' ? 1 : page.kind === 'legal' ? 0.3 : 0.8,
  }));
}
