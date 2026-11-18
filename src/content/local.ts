import rawPages from './pages.json';
import { PageSchema, QuoteFormContentSchema, SiteSettingsSchema, type ContentPage } from './schema';
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
