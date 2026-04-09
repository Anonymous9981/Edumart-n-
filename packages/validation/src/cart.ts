import { z } from 'zod';

// Cart schemas
export const addToCartSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().int().positive('Quantity must be at least 1'),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().positive('Quantity must be at least 1'),
});

export const checkoutSchema = z.object({
  shippingAddressId: z.string().min(1, 'Shipping address is required'),
  billingAddressId: z.string().optional(),
  couponCode: z.string().optional(),
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().int().positive(),
    })
  ).min(1, 'At least one item is required'),
});

export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
