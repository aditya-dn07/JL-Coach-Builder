import targets from '../content/seo-targets.json';

export const PRODUCTION_ORIGIN = new URL(targets[0].canonical).origin;
const normalPath = (path: string) => path.split(/[?#]/)[0].replace(/\/+$/, '') || '/';
const byPath = new Map(targets.flatMap(target => [
  [normalPath(target.current_new_path), target] as const,
  [normalPath(target.target_path), target] as const,
]));
const additionalPages = new Set(['/reviews', '/privacy-policy', '/terms-and-conditions', '/quote-result']);

export function getSeoTarget(path: string) {
  return byPath.get(normalPath(path));
}

// Only existing public routes participate. Unknown/retired pages never get redirects.
export function publicPagePath(path: string): string | undefined {
  const normalized = normalPath(path);
  return byPath.get(normalized)?.target_path ?? (additionalPages.has(normalized) ? normalized + '/' : undefined);
}

export function internalHref(href: string): string {
  if (!href.startsWith('/') && !href.startsWith('http://') && !href.startsWith('https://')) return href;
  try {
    const url = new URL(href, PRODUCTION_ORIGIN);
    if (url.origin !== PRODUCTION_ORIGIN) return href;
    if (/^\/(?:api|studio|_next)(?:\/|$)/.test(url.pathname) || /\.[a-z0-9]+$/i.test(url.pathname)) return href;
    const post = url.pathname.match(/^\/blogs?\/([a-z0-9-]+)\/?$/);
    const path = publicPagePath(url.pathname) ?? (post ? '/blogs/' + post[1] + '/' : url.pathname);
    return path + url.search + url.hash;
  } catch { return href; }
}

// Correct CMS-managed destinations without changing any label or published CMS record.
export function correctInternalHrefs<T>(value: T): T {
  if (Array.isArray(value)) return value.map(correctInternalHrefs) as T;
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key,
    typeof entry === 'string' && (key === 'href' || key.endsWith('Href') || key === 'quoteTarget')
      ? internalHref(entry) : correctInternalHrefs(entry),
  ])) as T;
}
