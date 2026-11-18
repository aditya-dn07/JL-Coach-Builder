import { internalHref } from './seo-targets';
// Public pages use trailing slashes; queries/fragments do not belong in canonical URLs.
export function pageUrl(path: string, base: string): string {
  const url = new URL(path, base);
  const canonicalPath = internalHref(url.pathname).replace(/\/+$/, '');
  url.pathname = canonicalPath ? canonicalPath + '/' : '/';
  url.search = '';
  url.hash = '';
  return url.href;
}
