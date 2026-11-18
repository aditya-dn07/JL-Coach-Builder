import { z } from 'zod';
import { SiteSchema } from '@/data/site.schema';
export const CONTENT_PLACEHOLDERS = {
  subheading: '[Subheading needed]',
  heading: '[Heading needed]',
  description: '[Description needed]',
} as const;
export const RichInlineSchema = z.array(z.object({ _type: z.string(), _key: z.string().optional() }).passthrough());
export const ActionSettingsSchema = z.object({ quoteLabel: z.string(), quoteHref: z.string(), callLabel: z.string(), callHref: z.string(), viewAllLabel: z.string().optional(), viewAllHref: z.string().optional() });
export const ImageSchema = z.object({
  src: z.string().min(1),
  alt: z.string(),
  decorative: z.boolean().optional(),
  caption: z.string().optional(),
  originalSrc: z.string().optional(),
  focalPoint: z.object({ x: z.number(), y: z.number() }).optional(),
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
  richText: RichInlineSchema.optional(),
});
export const PageSchema = z.object({
  id: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9-]*$/),
  label: z.string().min(1),
  title: z.string().min(1),
  eyebrow: z.string(),
  description: z.string(),
  descriptionLinks: z.array(NavigationLinkSchema).optional(),
  descriptionRichText: RichInlineSchema.optional(),
  intro: z.array(z.string()),
  introLinks: z.array(z.object({ index: z.number().int().nonnegative(), links: z.array(NavigationLinkSchema) })).optional(),
  kind: z.enum(['home', 'service', 'about', 'contact', 'legal', 'gallery', 'reviews', 'faqs']),
  image: z.enum(['workshop', 'caravan', 'campervan', 'motorhome', 'fifth-wheel', 'bus']),
  heroImage: ImageSchema.optional(),
  closingImage: ImageSchema.optional(),
  bannerActions: ActionSettingsSchema.optional(),
  reviewIds: z.array(z.string()).optional(),
  reviewAriaLabel: z.string().optional(),
  introduction: z.array(ContentBlockSchema).optional(),
  faqTopics: z.array(z.object({ id: z.string(), sourcePageId: z.string(), eyebrow: z.string(), title: z.string(), description: z.string(), descriptionLinks: z.array(NavigationLinkSchema).optional(), descriptionRichText: RichInlineSchema.optional(), faqs: z.array(z.object({ question: z.string(), answer: z.string(), answerLinks: z.array(NavigationLinkSchema).optional(), richText: RichInlineSchema.optional() })) })).optional(),
  benefitImages: z.array(ImageSchema).optional(),
  homeUi: z.record(z.string(), z.string()).optional(),
  closingCta: z.object({ eyebrow: z.string(), title: z.string(), description: z.string(), quoteLabel: z.string(), callLabel: z.string(), quoteHref: z.string().optional(), callHref: z.string().optional(), descriptionRichText: RichInlineSchema.optional(), contactCallLabel: z.string().optional(), contactEmailLabel: z.string().optional(), emailHref: z.string().optional() }).optional(),
  relatedServices: z.array(NavigationLinkSchema).optional(),
  updatedAt: z.string().optional(),
  seo: z.object({ title: z.string().min(1), description: z.string().min(1), canonical: z.string().optional(), noindex: z.boolean().optional(), ogImage: ImageSchema.optional() }),
  sections: z.array(
    z.object({
      layout: z.enum(['faq','reviews','timeline','structured','imageCards','imageSplit','trust','benefits','checklist','cards','prose','split']).optional(),
      ctaAfter: z.boolean().optional(),
      leadingCopy: z.number().optional(),
      relatedBlockIndices: z.array(z.number()).optional(),
      iconNames: z.array(z.string()).optional(),
      actions: ActionSettingsSchema.optional(), ui: z.record(z.string(), z.string()).optional(),
      descriptionRichText: RichInlineSchema.optional(),
      metrics: z.array(z.object({ value: z.string(), label: z.string(), kind: z.enum(['rating','text']), links: z.array(NavigationLinkSchema).optional() })).optional(),
      assurances: z.array(ContentBlockSchema).optional(),
      serviceCards: z.array(z.object({ vehicleId: z.string(), title: z.string(), description: z.string(), descriptionLinks: z.array(NavigationLinkSchema).optional(), descriptionRichText: RichInlineSchema.optional(), href: z.string().optional(), image: ImageSchema.optional(), links: z.array(NavigationLinkSchema).optional() })).optional(),
      helpCard: z.object({ eyebrow: z.string(), title: z.string(), description: z.string(), descriptionLinks: z.array(NavigationLinkSchema).optional(), descriptionRichText: RichInlineSchema.optional() }).optional(),
      capabilities: z.array(z.string()).optional(),
      comparison: z.object({ before: z.string(), after: z.string(), captionLine1: z.string(), captionLine2: z.string(), yearsValue: z.string(), yearsSuffix: z.string(), yearsLabel1: z.string(), yearsLabel2: z.string() }).optional(),
      bodyBlocks: z.array(ContentBlockSchema).optional(), introduction: z.array(ContentBlockSchema).optional(), items: z.array(ContentBlockSchema).optional(),
      closingImage: ImageSchema.optional(), relatedServices: z.array(NavigationLinkSchema).optional(), reviewIds: z.array(z.string()).optional(), reviews: z.array(z.object({ text: z.string(), author: z.string() })).optional(),
      id: z.string(), title: z.string(), eyebrow: z.string().optional(), description: z.string().optional(), descriptionLinks: z.array(NavigationLinkSchema).optional(), image: ImageSchema.optional(), cardImages: z.array(ImageSchema).optional(), cards: z.array(z.object({ title: z.string(), description: z.string(), descriptionRichText: RichInlineSchema.optional() })).optional(), descriptionParagraphs: z.array(ContentBlockSchema).optional(), cta: z.string().optional(), leadIn: ContentBlockSchema.optional(), closingNote: ContentBlockSchema.optional(), blocks: z.array(ContentBlockSchema) })
  ),
  faqs: z.array(z.object({ question: z.string().min(1), answer: z.string().min(1), answerLinks: z.array(NavigationLinkSchema).optional(), richText: RichInlineSchema.optional() })),
});
export type ContentPage = z.infer<typeof PageSchema>;
