import { PageSchema, QuoteFormContentSchema, SiteSettingsSchema, type ContentPage, type QuoteFormContent, type SiteSettings } from '@/content/schema';
function recordFromPairs(value: unknown): unknown {
  if (!Array.isArray(value)) return value;
  const record: Record<string, unknown> = {};
  for (const item of value) {
    if (!item || typeof item !== 'object' || !('key' in item) || typeof item.key !== 'string' || !item.key || item.key in record) throw new Error('CMS setting keys must be unique non-empty strings.');
    record[item.key] = 'value' in item ? item.value : Object.fromEntries(Object.entries(item).filter(([key]) => !['_key', '_type', 'key'].includes(key)));
  }
  return record;
}
function normalizeRecordFields(value: unknown, fields: string[]) {
  if (!value || typeof value !== 'object') return value;
  const result: Record<string, unknown> = { ...value };
  for (const field of fields) result[field] = recordFromPairs(result[field]);
  return result;
}
export function normalizeCmsSettings(site: unknown, quoteForm: unknown): { site: SiteSettings; quoteForm: QuoteFormContent } {
  const normalizedSite = normalizeRecordFields(site, ['ui', 'images']);
  const normalizedQuote = normalizeRecordFields(quoteForm, ['ui']);
  if (normalizedQuote && typeof normalizedQuote === 'object' && 'form' in normalizedQuote)
    normalizedQuote.form = normalizeRecordFields(normalizedQuote.form, ['labels', 'messages']);
  return { site: SiteSettingsSchema.parse(normalizedSite), quoteForm: QuoteFormContentSchema.parse(normalizedQuote) };
}
export async function readCmsSettings(provider: 'sanity' | 'payload'): Promise<{ site: SiteSettings; quoteForm: QuoteFormContent }> {
  if (provider === 'sanity') {
    const project = process.env.SANITY_PROJECT_ID;
    const dataset = process.env.SANITY_DATASET ?? 'production';
    if (!project || !/^[a-z0-9-]+$/.test(project) || !/^[-\w]+$/.test(dataset)) throw new Error('Configure a valid SANITY_PROJECT_ID and SANITY_DATASET.');
    const query = '{"site": *[_type == "siteSettings" && !(_id in path("drafts.**"))][0], "quoteForm": *[_type == "quoteFormContent" && !(_id in path("drafts.**"))][0]}';
    const response = await fetch(`https://${project}.api.sanity.io/v2025-02-19/data/query/${dataset}?query=${encodeURIComponent(query)}`, {
      headers: process.env.SANITY_API_TOKEN ? { Authorization: `Bearer ${process.env.SANITY_API_TOKEN}` } : {}, next: { revalidate: 60 },
    });
    if (!response.ok) throw new Error(`Sanity settings request failed (${response.status}).`);
    const result = (await response.json()).result;
    return normalizeCmsSettings(result?.site, result?.quoteForm);
  }
  const origin = process.env.PAYLOAD_API_URL;
  if (!origin) throw new Error('Configure PAYLOAD_API_URL.');
  const base = `${origin.replace(/\/$/, '')}/`;
  const headers: Record<string, string> = process.env.PAYLOAD_API_KEY ? { Authorization: `users API-Key ${process.env.PAYLOAD_API_KEY}` } : {};
  const [siteResponse, quoteResponse] = await Promise.all([
    fetch(new URL('globals/site-settings', base), { headers, next: { revalidate: 60 } }),
    fetch(new URL('globals/quote-form-content', base), { headers, next: { revalidate: 60 } }),
  ]);
  if (!siteResponse.ok || !quoteResponse.ok) throw new Error(`Payload settings request failed (${siteResponse.status}, ${quoteResponse.status}).`);
  return normalizeCmsSettings(await siteResponse.json(), await quoteResponse.json());
}
/** Server-only: called by the repository. Never import this module into client components. */
export async function readCmsPages(provider: 'sanity' | 'payload'): Promise<ContentPage[]> {
  let data: unknown;
  if (provider === 'sanity') {
    const project = process.env.SANITY_PROJECT_ID;
    const dataset = process.env.SANITY_DATASET ?? 'production';
    if (!project || !/^[a-z0-9-]+$/.test(project) || !/^[-\w]+$/.test(dataset))
      throw new Error('Configure a valid SANITY_PROJECT_ID and SANITY_DATASET.');
    const query = '*[_type == "page" && !(_id in path("drafts.**"))]';
    const response = await fetch(
      `https://${project}.api.sanity.io/v2025-02-19/data/query/${dataset}?query=${encodeURIComponent(query)}`,
      {
        headers: process.env.SANITY_API_TOKEN
          ? { Authorization: `Bearer ${process.env.SANITY_API_TOKEN}` }
          : {},
        next: { revalidate: 60 },
      }
    );
    if (!response.ok) throw new Error(`Sanity content request failed (${response.status}).`);
    data = (await response.json()).result;
  } else {
    const origin = process.env.PAYLOAD_API_URL;
    if (!origin) throw new Error('Configure PAYLOAD_API_URL.');
    const url = new URL(
      'pages?limit=100&depth=0&where[_status][equals]=published',
      `${origin.replace(/\/$/, '')}/`
    );
    const response = await fetch(url, {
      headers: process.env.PAYLOAD_API_KEY
        ? { Authorization: `users API-Key ${process.env.PAYLOAD_API_KEY}` }
        : {},
      next: { revalidate: 60 },
    });
    if (!response.ok) throw new Error(`Payload content request failed (${response.status}).`);
    const result = await response.json();
    if (result.hasNextPage)
      throw new Error('CMS has more than 100 pages; add pagination before publishing.');
    data = result.docs;
  }
  if (!Array.isArray(data) || !data.length)
    throw new Error('CMS returned no published pages. Import the website content first.');
  const pages = data.map((item) => {
    if (item && typeof item === 'object' && 'homeUi' in item) return PageSchema.parse({ ...item, homeUi: recordFromPairs(item.homeUi) });
    return PageSchema.parse(item);
  });
  if (new Set(pages.map((p) => p.slug)).size !== pages.length)
    throw new Error('CMS page slugs must be unique.');
  if (!pages.some((p) => p.slug === ''))
    throw new Error('CMS must include a homepage with an empty slug.');
  return pages;
}
