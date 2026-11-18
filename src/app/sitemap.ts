import type { MetadataRoute } from 'next';
import { getBlogSitemapPosts, getBlogPage } from '../lib/sanity/blog';
import { getPublicContent } from '../lib/sanity/public-content';
import { pageUrl } from '../lib/site-url';
import { PRODUCTION_ORIGIN } from '../lib/seo-targets';
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { pages, editorial } = await getPublicContent();
  const settings = editorial.sitemap;
  const entries: MetadataRoute.Sitemap = pages.filter(page => !page.seo.noindex && !settings.excludedPaths.includes(page.slug ? '/' + page.slug + '/' : '/')).map(page => ({
    url: pageUrl(page.slug ? '/' + page.slug : '/', PRODUCTION_ORIGIN),
    changeFrequency: settings.changeFrequency as MetadataRoute.Sitemap[number]['changeFrequency'],
    priority: page.kind === 'home' ? settings.homePriority : page.kind === 'legal' ? settings.legalPriority : settings.pagePriority,
  }));
  const posts = await getBlogSitemapPosts();
  if (!(await getBlogPage()).seo.noindex) entries.push({ url: pageUrl('/blogs/', PRODUCTION_ORIGIN), changeFrequency: 'weekly', priority: 0.7 });
  entries.push(...posts.filter(post => !post.seo?.noindex).map(post => ({ url: pageUrl('/blogs/' + post.slug.current + '/', PRODUCTION_ORIGIN), lastModified: post.publishedAt, changeFrequency: 'monthly' as const, priority: 0.6 })));
  return entries;
}
