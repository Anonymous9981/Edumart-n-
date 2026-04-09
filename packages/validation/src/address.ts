import { z } from 'zod';

// Address schema
export const addressSchema = z.object({
  label: z.enum(['HOME', 'WORK', 'OTHER']).optional(),
  fullName: z.string().min(2, 'Full name is required'),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number'),
  addressLine1: z.string().min(5, 'Address is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zipCode: z.string().min(3, 'Zip code is required'),
  country: z.string().min(2, 'Country is required'),
  isDefault: z.boolean().optional().default(false),
});

export type AddressInput = z.infer<typeof addressSchema>;
