import rawPages from './pages.json';
import { PageSchema, type ContentPage } from './schema';
import { readCmsPages } from '@/cms/adapters';
export const pages = rawPages.map((page) => PageSchema.parse(page));
export const galleryPage: ContentPage = PageSchema.parse({
  id: 'gallery',
  slug: 'gallery',
  label: 'Our work',
  title: 'A closer look at our craft.',
  eyebrow: 'The workshop journal',
  description:
    'Explore the caravans, motorhomes and specialist vehicles we work on at our Christchurch workshop.',
  intro: [],
  kind: 'gallery',
  image: 'workshop',
  seo: {
    title: 'Workshop Gallery | JL Coachbuilders',
    description:
      'Explore specialist vehicle and workshop photographs from JL Coachbuilders in Christchurch.',
  },
  sections: [],
  faqs: [],
});
export const allPages = [...pages, galleryPage];
export interface ContentRepository {
  getPages(): Promise<ContentPage[]>;
  getPage(slug: string): Promise<ContentPage | undefined>;
}
// Swap this repository for a Sanity or Payload adapter. Validate remote results with PageSchema.
async function getPages() {
  const source = process.env.CONTENT_SOURCE ?? 'local';
  if (source === 'local') return allPages;
  if (source !== 'sanity' && source !== 'payload')
    throw new Error('CONTENT_SOURCE must be local, sanity or payload.');
  return readCmsPages(source);
}
export const contentRepository: ContentRepository = {
  getPages,
  async getPage(slug) {
    return (await getPages()).find((page) => page.slug === slug);
  },
};
