import { z } from 'zod';

// Vendor profile schema
export const vendorProfileSchema = z.object({
  storeName: z.string().min(3).max(255),
  description: z.string().optional(),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number'),
  bankAccountName: z.string().optional(),
  bankAccountNumber: z.string().optional(),
  bankCode: z.string().optional(),
  taxId: z.string().optional(),
});

export type VendorProfileInput = z.infer<typeof vendorProfileSchema>;
