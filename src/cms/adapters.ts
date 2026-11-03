import { PageSchema, type ContentPage } from '@/content/schema';
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
  const pages = data.map((item) => PageSchema.parse(item));
  if (new Set(pages.map((p) => p.slug)).size !== pages.length)
    throw new Error('CMS page slugs must be unique.');
  if (!pages.some((p) => p.slug === ''))
    throw new Error('CMS must include a homepage with an empty slug.');
  return pages;
}
