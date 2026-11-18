import 'server-only';
import { getSanityIdentifiers } from './config';
export async function fetchPublished<T>(query: string, params: Record<string, unknown> = {}, tags = ['sanity:content']): Promise<T | undefined> {
  const { projectId: project, dataset } = getSanityIdentifiers();
  if (process.env.CONTENT_SOURCE === 'local' || process.env.CONTENT_SOURCE === 'payload' || !project || !/^[a-z0-9-]+$/.test(project) || !/^[-\w]+$/.test(dataset)) return undefined;
  const url = new URL('https://' + project + '.api.sanity.io/v2025-02-19/data/query/' + dataset);
  url.searchParams.set('query', query);
  url.searchParams.set('perspective', 'published');
  for (const [key, value] of Object.entries(params)) url.searchParams.set('$' + key, JSON.stringify(value));
  try {
    const response = await fetch(url, {
      headers: process.env.SANITY_API_TOKEN ? { Authorization: 'Bearer ' + process.env.SANITY_API_TOKEN } : {},
      next: { revalidate: 60, tags }, signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return undefined;
    return (await response.json() as { result?: T }).result;
  } catch { return undefined; } // Local defaults keep the site available on CMS failure.
}
