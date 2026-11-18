import 'server-only';
import defaults from '../../cms/sanity/defaults.json';
import { fetchPublished } from './client';

type Target = { _id: string; _type: string; title?: string; slug?: string | { current?: string } };
const existingPages = new Set(defaults.registry.map(page => page.slug));
export async function expandInternalReferences<T>(value: T): Promise<T> {
  const ids = new Set<string>();
  function collect(node: unknown) {
    if (Array.isArray(node)) { node.forEach(collect); return; }
    if (!node || typeof node !== 'object') return;
    const item = node as Record<string, unknown>;
    const reference = item.reference as { _ref?: string } | undefined;
    if (item._type === 'internalLink' && reference?._ref) ids.add(reference._ref);
    if (Array.isArray(item.relatedLinks)) for (const link of item.relatedLinks) if (link?._ref) ids.add(link._ref);
    Object.values(item).forEach(collect);
  }
  collect(value);
  if (!ids.size) return value;
  const targets = await fetchPublished<Target[]>(
    '*[_id in $ids && !(_id in path("drafts.**")) && (_type == "pageSettings" || (_type == "blogPost" && publishedAt <= now()))]{_id,_type,title,slug}',
    { ids: [...ids].filter(id => !id.startsWith('drafts.')) }, ['sanity:content', 'sanity:blog'],
  );
  const links = new Map<string, { label: string; href: string }>();
  for (const target of targets ?? []) {
    const slug = typeof target.slug === 'string' ? target.slug : target.slug?.current;
    if (typeof slug !== 'string' || !/^[a-z0-9-]*$/.test(slug)) continue;
    if (target._type === 'pageSettings' && existingPages.has(slug)) links.set(target._id, { label: target.title || 'Home', href: slug ? '/' + slug : '/' });
    if (target._type === 'blogPost' && slug) links.set(target._id, { label: target.title || slug, href: '/blogs/' + slug });
  }
  function expand(node: unknown): unknown {
    if (Array.isArray(node)) return node.map(expand);
    if (!node || typeof node !== 'object') return node;
    const item = node as Record<string, unknown>;
    const result = Object.fromEntries(Object.entries(item).map(([key, entry]) => [key, expand(entry)]));
    if (item._type === 'internalLink') {
      const id = (item.reference as { _ref?: string } | undefined)?._ref;
      result.href = id ? links.get(id)?.href : undefined;
    }
    if (Array.isArray(item.relatedLinks)) {
      const resolved = item.relatedLinks.flatMap(link => links.get(link?._ref) ?? []);
      result.relatedLinks = [...new Map(resolved.map(link => [link.href, link])).values()];
    }
    return result;
  }
  return expand(value) as T;
}
