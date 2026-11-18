import type { MetadataRoute } from 'next';
import { getBlogSitemapPosts, getBlogPage } from '../lib/sanity/blog';
import { getPublicContent } from '../lib/sanity/public-content';
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { pages, siteSettings, editorial } = await getPublicContent();
  const settings = editorial.sitemap;
  const entries: MetadataRoute.Sitemap = pages.filter(page => !page.seo.noindex && !settings.excludedPaths.includes(page.slug ? '/' + page.slug + '/' : '/')).map(page => ({
    url: new URL(page.slug ? '/' + page.slug + '/' : '/', siteSettings.url).href,
    changeFrequency: settings.changeFrequency as MetadataRoute.Sitemap[number]['changeFrequency'],
    priority: page.kind === 'home' ? settings.homePriority : page.kind === 'legal' ? settings.legalPriority : settings.pagePriority,
  }));
  const posts = await getBlogSitemapPosts();
  if (!(await getBlogPage()).seo.noindex) entries.push({ url: new URL('/blog/', siteSettings.url).href, changeFrequency: 'weekly', priority: 0.7 });
  entries.push(...posts.filter(post => !post.seo?.noindex).map(post => ({ url: new URL('/blog/' + post.slug.current + '/', siteSettings.url).href, lastModified: post.publishedAt, changeFrequency: 'monthly' as const, priority: 0.6 })));
  return entries;
}
