import { z } from 'zod';
export const ContentBlockSchema = z.object({
  type: z.enum(['heading', 'paragraph']),
  text: z.string().min(1),
});
export const PageSchema = z.object({
  id: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9-]*$/),
  label: z.string().min(1),
  title: z.string().min(1),
  eyebrow: z.string(),
  description: z.string(),
  intro: z.array(z.string()),
  kind: z.enum(['home', 'service', 'about', 'contact', 'legal', 'gallery']),
  image: z.enum(['workshop', 'caravan', 'campervan', 'motorhome', 'fifth-wheel', 'bus']),
  updatedAt: z.string().optional(),
  seo: z.object({ title: z.string().min(1), description: z.string().min(1) }),
  sections: z.array(
    z.object({ id: z.string(), title: z.string(), blocks: z.array(ContentBlockSchema) })
  ),
  faqs: z.array(z.object({ question: z.string().min(1), answer: z.string().min(1) })),
});
export type ContentPage = z.infer<typeof PageSchema>;
