import { z } from 'zod';

// Category schema
export const categorySchema = z.object({
  name: z.string().min(2, 'Category name is required').max(255),
  slug: z.string().min(2).max(255).optional(),
  description: z.string().optional(),
  parentId: z.string().optional(),
  isActive: z.boolean().optional().default(true),
});

// Coupon schema
export const couponSchema = z.object({
  code: z.string().min(3).max(50),
  type: z.enum(['PERCENTAGE', 'FIXED_AMOUNT']),
  value: z.number().positive(),
  minOrderValue: z.number().min(0).optional().default(0),
  maxDiscount: z.number().optional(),
  usageLimit: z.number().int().optional(),
  validFrom: z.date(),
  validTo: z.date(),
  isActive: z.boolean().optional().default(true),
});

// Banner schema
export const bannerSchema = z.object({
  title: z.string().min(3).max(255),
  content: z.string().optional(),
  imageUrl: z.string().url(),
  link: z.string().url().optional(),
  validFrom: z.date(),
  validTo: z.date(),
  isActive: z.boolean().optional().default(true),
});

export type CategoryInput = z.infer<typeof categorySchema>;
export type CouponInput = z.infer<typeof couponSchema>;
export type BannerInput = z.infer<typeof bannerSchema>;
