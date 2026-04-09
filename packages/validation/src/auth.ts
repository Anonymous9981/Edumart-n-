import { z } from 'zod';

// Shared validators
const optionalTrimmedString = (value: unknown) => {
  if (typeof value !== 'string') {
    return value;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

export const emailSchema = z.string().trim().email('Invalid email address').toLowerCase();
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');
export const nameSchema = z.string().trim().min(2, 'Name must be at least 2 characters').max(100);
export const phoneSchema = z.preprocess(
  optionalTrimmedString,
  z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number').optional(),
);

// Auth schemas
export const signupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  firstName: nameSchema,
  lastName: nameSchema,
  phone: phoneSchema.optional(),
  storeName: z.preprocess(
    optionalTrimmedString,
    z.string().min(3, 'Store name must be at least 3 characters').max(255).optional(),
  ),
  role: z.enum(['CUSTOMER', 'VENDOR']),
})
.refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})
.refine((data) => data.role !== 'VENDOR' || Boolean(data.storeName?.trim()), {
  message: 'Store name is required for vendor signup',
  path: ['storeName'],
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional().default(false),
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: passwordSchema,
  confirmPassword: z.string(),
})
.refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
