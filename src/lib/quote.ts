import { z } from 'zod';
import { siteConfig } from '@/config/site';
export const QuoteSchema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z
    .string()
    .trim()
    .min(7)
    .max(30)
    .regex(/^[+()\d\s-]+$/)
    .refine((value) => value.replace(/\D/g, '').length >= 7),
  email: z.email().max(254),
  vehicle: z.enum(siteConfig.vehicleTypes as [string, ...string[]]).optional(),
  message: z.string().trim().min(10).max(4000),
  website: z.string().max(0),
});
