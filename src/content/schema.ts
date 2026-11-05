import { z } from 'zod';
import { SiteSchema } from '@/data/site.schema';
export const CONTENT_PLACEHOLDERS = {
  subheading: '[Subheading needed]',
  heading: '[Heading needed]',
  description: '[Description needed]',
} as const;
export const ImageSchema = z.object({
  src: z.string().min(1),
  alt: z.string(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});
export type ContentImage = z.infer<typeof ImageSchema>;
export const NavigationLinkSchema = z.object({ label: z.string().min(1), href: z.string().min(1) });
export const SiteSettingsSchema = SiteSchema.pick({ url: true, seo: true, business: true }).extend({
  ui: z.record(z.string(), z.string()),
  images: z.record(z.string(), ImageSchema),
  navigation: z.object({ main: z.array(NavigationLinkSchema), footerExtra: z.array(NavigationLinkSchema) }),
  language: z.string(), locale: z.string(), vehicleTypes: z.array(z.string()), themeColor: z.string(),
});
export const QuoteFormContentSchema = z.object({
  title: z.string(),
  ui: z.record(z.string(), z.string()),
  form: z.object({ labels: z.record(z.string(), z.string()), messages: z.record(z.string(), z.string()) }),
});
export type SiteSettings = z.infer<typeof SiteSettingsSchema>;
export type QuoteFormContent = z.infer<typeof QuoteFormContentSchema>;
export const ContentBlockSchema = z.object({
  type: z.enum(['heading', 'paragraph']),
  text: z.string().min(1),
  links: z.array(NavigationLinkSchema).optional(),
});
export const PageSchema = z.object({
  id: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9-]*$/),
  label: z.string().min(1),
  title: z.string().min(1),
  eyebrow: z.string(),
  description: z.string(),
  descriptionLinks: z.array(NavigationLinkSchema).optional(),
  intro: z.array(z.string()),
  introLinks: z.array(z.object({ index: z.number().int().nonnegative(), links: z.array(NavigationLinkSchema) })).optional(),
  kind: z.enum(['home', 'service', 'about', 'contact', 'legal', 'gallery', 'reviews', 'faqs']),
  image: z.enum(['workshop', 'caravan', 'campervan', 'motorhome', 'fifth-wheel', 'bus']),
  heroImage: ImageSchema.optional(),
  closingImage: ImageSchema.optional(),
  homeUi: z.record(z.string(), z.string()).optional(),
  closingCta: z.object({ eyebrow: z.string(), title: z.string(), description: z.string(), quoteLabel: z.string(), callLabel: z.string() }).optional(),
  relatedServices: z.array(NavigationLinkSchema).optional(),
  updatedAt: z.string().optional(),
  seo: z.object({ title: z.string().min(1), description: z.string().min(1) }),
  sections: z.array(
    z.object({ id: z.string(), title: z.string(), eyebrow: z.string().optional(), description: z.string().optional(), descriptionLinks: z.array(NavigationLinkSchema).optional(), image: ImageSchema.optional(), cardImages: z.array(ImageSchema).optional(), cards: z.array(z.object({ title: z.string(), description: z.string() })).optional(), descriptionParagraphs: z.array(ContentBlockSchema).optional(), cta: z.string().optional(), leadIn: ContentBlockSchema.optional(), closingNote: ContentBlockSchema.optional(), blocks: z.array(ContentBlockSchema) })
  ),
  faqs: z.array(z.object({ question: z.string().min(1), answer: z.string().min(1), answerLinks: z.array(NavigationLinkSchema).optional() })),
});
export type ContentPage = z.infer<typeof PageSchema>;
