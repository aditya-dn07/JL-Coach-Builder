import { z } from 'zod';

const text = z.string().min(1);
export const CtaSchema = z.object({ label: text, href: text });
export const ImageRefSchema = z.object({
  id: text,
  originalSrc: text,
  optimizedSrc: text,
  alt: text,
  width: z.number().positive(),
  height: z.number().positive(),
  focalPoint: z.object({ x: z.number().min(0).max(1), y: z.number().min(0).max(1) }),
  treatment: z.enum(['stripe', 'tile', 'logo']),
});
export const BusinessSchema = z.object({
  name: text,
  tagline: text,
  phone: text,
  email: z.email(),
  address: z.object({ street: text, locality: text, postcode: text, country: text }),
  geo: z.object({ latitude: z.number(), longitude: z.number() }).optional(),
  openingHours: z.array(text).optional(),
  foundedYear: z.literal(2016),
  sameAs: z.array(z.url()),
  googleRating: z.object({
    value: z.number().min(1).max(5),
    reviewCount: z.number().int().positive().nullable(),
    reviewClaim: text,
  }),
});
export interface NavItem {
  label: string;
  href: string;
  children: NavItem[];
}
export const NavItemSchema: z.ZodType<NavItem> = z.object({
  label: text,
  href: text,
  children: z.array(z.lazy(() => NavItemSchema)),
});
export const HeroSchema = z.object({
  eyebrow: text,
  h1: text,
  highlightWord: text,
  chips: z.array(text),
  primaryCta: CtaSchema,
  secondaryCta: CtaSchema,
  image: ImageRefSchema,
  trustBadges: z.array(z.object({ value: text, label: text })),
});
export const ServiceSchema = z.object({
  id: text,
  title: text,
  shortDescription: text,
  href: text,
  image: ImageRefSchema,
  size: z.enum(['large', 'small']),
});
export const StatSchema = z.object({ value: z.number(), suffix: z.string(), label: text });
export const ReviewSchema = z.object({
  author: text,
  location: text,
  text: text,
  rating: z.number().min(1).max(5).nullable(),
});
export const FaqSchema = z.object({ question: text, answer: text });
export const SiteSchema = z.object({
  url: z.url(),
  seo: z.object({ title: text, description: text }),
  business: BusinessSchema,
  logo: ImageRefSchema,
  nav: z.array(NavItemSchema),
  quickLinks: z.array(CtaSchema),
  hero: HeroSchema,
  services: z.array(ServiceSchema).length(5),
  whatWeDo: z.object({
    eyebrow: text,
    title: text,
    badge: text,
    paragraphs: z.array(text).length(5),
    ticks: z.array(text).length(4),
  }),
  repairsIntro: z.object({ title: text, body: text }),
  difference: z.object({ title: text, paragraphs: z.array(text).length(6) }),
  whyChooseUs: z.array(z.object({ title: text, body: text })).length(4),
  stats: z.array(StatSchema).length(4),
  reviews: z.array(ReviewSchema).length(6),
  faqs: z.array(FaqSchema).length(4),
  copy: z.record(z.string(), text),
  form: z.object({ labels: z.record(z.string(), text), messages: z.record(z.string(), text) }),
});
export type Business = z.infer<typeof BusinessSchema>;
export type Hero = z.infer<typeof HeroSchema>;
export type Service = z.infer<typeof ServiceSchema>;
export type Stat = z.infer<typeof StatSchema>;
export type Review = z.infer<typeof ReviewSchema>;
export type Faq = z.infer<typeof FaqSchema>;
export type ImageRef = z.infer<typeof ImageRefSchema>;
export type Site = z.infer<typeof SiteSchema>;
