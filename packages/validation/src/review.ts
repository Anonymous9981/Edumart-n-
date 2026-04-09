import { z } from 'zod';

// Review schema
export const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  title: z.string().min(3, 'Title must be at least 3 characters').max(255).optional(),
  comment: z.string().min(10, 'Review must be at least 10 characters').max(1000),
});

export type ReviewInput = z.infer<typeof reviewSchema>;
