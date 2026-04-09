import { z } from 'zod';

// Product creation/update schema
export const productSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters').max(255),
  slug: z.string().min(3).max(255).optional(),
  description: z.string().min(10, 'Description must be at least 10 characters').optional(),
  shortDescription: z.string().max(500).optional(),
  categoryId: z.string().uuid('Invalid category ID'),
  basePrice: z.number().positive('Price must be greater than 0'),
  discountPercentage: z.number().min(0).max(100).optional().default(0),
  sku: z.string().min(2, 'SKU must be at least 2 characters').max(100),
  stock: z.number().int().min(0, 'Stock cannot be negative'),
  lowStockThreshold: z.number().int().min(0).optional().default(10),
  tags: z.array(z.string()).optional().default([]),
  images: z.array(
    z.object({
      url: z.string().url('Invalid image URL'),
      altText: z.string().optional(),
    })
  ).min(1, 'At least one image is required'),
});

export const updateProductSchema = productSchema.partial();

export const productQuerySchema = z.object({
  page: z.number().int().positive().optional().default(1),
  limit: z.number().int().positive().max(100).optional().default(20),
  search: z.string().optional(),
  categoryId: z.string().optional(),
  vendorId: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  sortBy: z.enum(['createdAt', 'price', 'rating', 'name']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  status: z.string().optional(),
});

export type ProductInput = z.infer<typeof productSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductQueryInput = z.infer<typeof productQuerySchema>;
