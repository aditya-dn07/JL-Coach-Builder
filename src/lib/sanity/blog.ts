import 'server-only';
import { cache } from 'react';
import { z } from 'zod';
import { ImageSchema } from '../../content/schema';
import defaults from '../../cms/sanity/defaults.json';
import { mergeContent } from '../../content/merge';
import { fetchPublished } from './client';
import { resolveImages } from './images';
import { singletonQuery } from './queries';
const image = ImageSchema;
const category = z.object({ _id: z.string(), title: z.string(), slug: z.object({ current: z.string() }), count: z.number().default(0) });
const postSchema = z.object({
  _id: z.string(), title: z.string(), slug: z.object({ current: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/) }),
  publishedAt: z.string().datetime(), excerpt: z.string().default(''),
  featuredImage: image.optional(), category: category.nullish(),
  author: z.object({ name: z.string(), photo: image.nullish(), role: z.string().optional(), bio: z.array(z.object({ _type: z.string() }).passthrough()).optional(), socialLinks: z.array(z.object({ label: z.string(), href: z.string() })).optional() }).nullish(),
  tags: z.array(category).nullish(), relatedPosts: z.array(z.object({ _ref: z.string() })).optional(),
  body: z.array(z.object({ _type: z.string(), _key: z.string().optional() }).passthrough()).default([]),
  seo: z.object({ title: z.string().optional(), description: z.string().optional(), canonical: z.string().optional(), noindex: z.boolean().optional(), ogImage: image.optional() }).nullish(),
});
export type BlogPost = z.infer<typeof postSchema>;
const projection = '{...,category->,author->,"tags": tags[]->}';
const eligible = '_type == "blogPost" && !(_id in path("drafts.**")) && publishedAt <= now()';
function postsFrom(value: unknown): BlogPost[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap(item => { const parsed = postSchema.safeParse(resolveImages(item)); return parsed.success ? [parsed.data] : []; });
}
export async function getBlogPosts(categorySlug = '', page = 1, size = 9, peek = false, tagSlug = '') {
  const offset = Math.max(0, page - 1) * size;
  const query = '*[' + eligible + ' && ($category == "" || category->slug.current == $category) && ($tag == "" || $tag in tags[]->slug.current)] | order(publishedAt desc) [$offset...$end]' + projection;
  return postsFrom(await fetchPublished(query, { category: categorySlug, tag: tagSlug, offset, end: offset + size + (peek ? 1 : 0) }, ['sanity:blog']));
}
export const getBlogPost = cache(async (slug: string): Promise<BlogPost | undefined> => {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return undefined;
  return postsFrom(await fetchPublished('*[' + eligible + ' && slug.current == $slug][0...1]' + projection, { slug }, ['sanity:blog']))[0];
});
export async function getRelatedPosts(post: BlogPost) {
  const ids = referenceIds(post.relatedPosts).filter(id => id !== post._id);
  const chosen = ids.length ? await getFeaturedPosts(ids, 3) : [];
  if (referenceIds(post.relatedPosts).length && chosen.length) return chosen;
  return postsFrom(await fetchPublished('*[' + eligible + ' && _id != $id && category._ref == $category] | order(publishedAt desc) [0...3]' + projection, { id: post._id, category: post.category?._id ?? '' }, ['sanity:blog']));
}
export const getCategories = cache(async () => {
  const value = await fetchPublished<unknown[]>('*[_type == "blogCategory" && !(_id in path("drafts.**"))] | order(title asc){_id,title,slug,"count": count(*[_type == "blogPost" && category._ref == ^._id && !(_id in path("drafts.**")) && publishedAt <= now()])}', {}, ['sanity:blog']);
  return (value ?? []).flatMap(item => { const parsed = category.safeParse(item); return parsed.success ? [parsed.data] : []; });
});
export async function getFeaturedPosts(ids: string[], maximum: number) {
  const limit = Math.max(0, Math.min(30, maximum));
  if (!limit) return [];
  const uniqueIds = [...new Set(ids)].slice(0, 50);
  if (uniqueIds.length) {
    const records = postsFrom(await fetchPublished('*[' + eligible + ' && _id in $ids]' + projection, { ids: uniqueIds }, ['sanity:blog']));
    return uniqueIds.flatMap(id => records.find(post => post._id === id) ?? []).slice(0, limit);
  }
  return postsFrom(await fetchPublished('*[' + eligible + ' && featured == true] | order(publishedAt desc) [0...$maximum]' + projection, { maximum: limit }, ['sanity:blog']));
}
export const getBlogPage = cache(async () => {
  const ids = defaults.registry.find(page => page.id === 'page.blog')!.items.map(item => item.id);
  const docs = await fetchPublished<(Record<string, unknown> & { _id: string })[]>(singletonQuery, { ids }, ['sanity:blog']);
  const map = new Map((docs ?? []).map(doc => [doc._id, doc]));
  const get = <T>(key: string, fallback: T): T => resolveImages(mergeContent(fallback, map.get('page.blog.' + key))) as T;
  return {
    settings: get('settings', defaults.seeds['page.blog.settings']), seo: get('seo', defaults.seeds['page.blog.seo']),
    banner: get('banner', { ...defaults.seeds['page.blog.banner'], image: defaults.seeds['page.blog.banner'].image as z.infer<typeof image> }), filters: get('filters', defaults.seeds['page.blog.filters']),
    featured: get('featured', defaults.seeds['page.blog.featured']), sidebar: get('sidebar', defaults.seeds['page.blog.sidebar']),
    internalCta: get('internalCta', defaults.seeds['page.blog.internalCta']), footerCta: get('footerCta', defaults.seeds['page.blog.footerCta']),
  };
});
export const getBlogSitemapPosts = async () => postsFrom(await fetchPublished('*[' + eligible + '] | order(publishedAt desc)' + projection, {}, ['sanity:blog']));
export const referenceIds = (value: unknown): string[] => Array.isArray(value) ? value.flatMap(item => item && typeof item === 'object' && '_ref' in item && typeof item._ref === 'string' ? [item._ref] : []) : [];
