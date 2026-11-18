import 'server-only';
import { getSanityIdentifiers } from './config';

// A failed read is not an empty dataset. Throwing lets ISR retain the last good
// page instead of successfully regenerating and caching source-backed defaults.
export class SanityContentReadError extends Error {
  constructor(readonly reason: 'configuration' | 'http' | 'timeout' | 'network' | 'response', readonly status?: number) {
    super(`[sanity:content] Published read failed (${reason}${status ? ` ${status}` : ''}).`);
    this.name = 'SanityContentReadError';
  }
}
export async function fetchPublished<T>(query: string, params: Record<string, unknown> = {}, tags = ['sanity:content']): Promise<T | undefined> {
  const { projectId: project, dataset } = getSanityIdentifiers();
  if (process.env.CONTENT_SOURCE === 'local' || process.env.CONTENT_SOURCE === 'payload') return undefined;
  if (!project && process.env.CONTENT_SOURCE !== 'sanity') return undefined;
  if (!project || !/^[a-z0-9-]+$/.test(project) || !/^[-\w]+$/.test(dataset)) throw new SanityContentReadError('configuration');
  const url = new URL('https://' + project + '.api.sanity.io/v2025-02-19/data/query/' + dataset);
  url.searchParams.set('query', query);
  url.searchParams.set('perspective', 'published');
  for (const [key, value] of Object.entries(params)) url.searchParams.set('$' + key, JSON.stringify(value));
  try {
    const response = await fetch(url, {
      headers: process.env.SANITY_API_TOKEN ? { Authorization: 'Bearer ' + process.env.SANITY_API_TOKEN } : {},
      next: { revalidate: 60, tags }, signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) throw new SanityContentReadError('http', response.status);
    let body: { result?: T };
    try { body = await response.json(); } catch { throw new SanityContentReadError('response'); }
    if (!body || typeof body !== 'object' || !Object.prototype.hasOwnProperty.call(body, 'result')) throw new SanityContentReadError('response');
    return body.result;
  } catch (error) {
    if (error instanceof SanityContentReadError) throw error;
    // Never attach the upstream error/URL/body: they may contain credentials.
    throw new SanityContentReadError(error instanceof Error && ['TimeoutError', 'AbortError'].includes(error.name) ? 'timeout' : 'network');
  }
}
