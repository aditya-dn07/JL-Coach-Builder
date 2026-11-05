import rawPages from './pages.json';
import { PageSchema, QuoteFormContentSchema, SiteSettingsSchema, type ContentPage } from './schema';
import { readCmsPages, readCmsSettings } from '@/cms/adapters';
import rawConfig from '@/config/site.json';
import rawGallery from '@/data/site-gallery.json';
import rawManifest from '@/data/image-manifest.json';
import rawQuoteForm from './quote-form.json';
import { z } from 'zod';
import { ImageSchema } from './schema';
import { SiteSchema } from '@/data/site.schema';
import { site } from '@/data/site.data';
export const pages = rawPages.map((page) => PageSchema.parse(page));
export const allPages = pages;
const galleryImageSchema = ImageSchema.extend({ source: z.string().optional() });
const manifestImageSchema = ImageSchema.extend({
  blurDataURL: z.string().optional(),
  variants: z.array(z.object({ src: z.string(), width: z.number().positive(), avif: z.string().optional(), webpBytes: z.number().optional(), avifBytes: z.number().optional() })).optional(),
});
const manifestSchema = z.record(z.string(), manifestImageSchema);
export const galleryImages = z.array(galleryImageSchema).parse(rawGallery);
export const imageManifest = manifestSchema.parse(rawManifest);
export const siteSettings = SiteSettingsSchema.parse(rawConfig);
export const quoteForm = QuoteFormContentSchema.parse(rawQuoteForm);
export const legacySite = SiteSchema.parse(site);
export interface ContentRepository {
  getPages(): Promise<ContentPage[]>;
  getPage(slug: string): Promise<ContentPage | undefined>;
  getGalleryImages(): typeof galleryImages;
  getImageManifest(): typeof imageManifest;
  getSiteSettings(): typeof siteSettings;
  getQuoteForm(): typeof quoteForm;
  getLegacySite(): typeof legacySite;
  getCmsSettings(): Promise<{ site: typeof siteSettings; quoteForm: typeof quoteForm }>;
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
  getGalleryImages: () => galleryImages,
  getImageManifest: () => imageManifest,
  getSiteSettings: () => siteSettings,
  getQuoteForm: () => quoteForm,
  getLegacySite: () => legacySite,
  async getCmsSettings() {
    const source = process.env.CONTENT_SOURCE ?? 'local';
    if (source === 'local') return { site: siteSettings, quoteForm };
    if (source !== 'sanity' && source !== 'payload') throw new Error('CONTENT_SOURCE must be local, sanity or payload.');
    return readCmsSettings(source);
  },
  async getPage(slug) {
    return (await getPages()).find((page) => page.slug === slug);
  },
};
