import { randomUUID } from 'crypto';

import { UserRole, VendorStatus } from '@edumart/shared';
import {
  forgotPasswordSchema,
  loginSchema,
  refreshTokenSchema,
  resetPasswordSchema,
  signupSchema,
} from '@edumart/validation';

import { prisma } from './prisma';
import {
  createResetToken,
  createTokenPair,
  getResetTokenExpiry,
  hashPassword,
  hashResetToken,
  hashToken,
  verifyPassword,
  verifyRefreshToken,
} from './auth';

export interface AuthRequestMeta {
  ipAddress?: string | null;
  userAgent?: string | null;
}

export interface PublicVendorProfile {
  id: string;
  storeName: string;
  verificationStatus: VendorStatus;
  rating: number | null;
  reviewCount: number;
}

export interface PublicUser {
  id: string;
  email: string;
  role: UserRole;
  firstName: string | null;
  lastName: string | null;
  avatar: string | null;
  phone: string | null;
  isActive: boolean;
  isEmailVerified: boolean;
  vendorProfile: PublicVendorProfile | null;
}

function toPublicUser(user: {
  id: string;
  email: string;
  role: string;
  firstName: string | null;
  lastName: string | null;
  avatar: string | null;
  phone: string | null;
  isActive: boolean;
  isEmailVerified: boolean;
  vendorProfile?: {
    id: string;
    storeName: string;
    verificationStatus: unknown;
    rating: number | null;
    reviewCount: number;
  } | null;
}): PublicUser {
  const vendorProfile = user.vendorProfile
    ? {
        id: user.vendorProfile.id,
        storeName: user.vendorProfile.storeName,
        verificationStatus: user.vendorProfile.verificationStatus as VendorStatus,
        rating: user.vendorProfile.rating,
        reviewCount: user.vendorProfile.reviewCount,
      }
    : null;

  return {
    id: user.id,
    email: user.email,
    role: user.role as UserRole,
    firstName: user.firstName,
    lastName: user.lastName,
    avatar: user.avatar,
    phone: user.phone,
    isActive: user.isActive,
    isEmailVerified: user.isEmailVerified,
    vendorProfile,
  };
}

export interface OAuthProfileInput {
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  avatar?: string | null;
  role?: UserRole;
}

async function issueTokensAndStoreSession(
  user: { id: string; email: string; role: UserRole },
  meta: AuthRequestMeta,
  rememberMe = false,
) {
  const tokenPair = await createTokenPair(user, rememberMe);

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      jti: tokenPair.refreshTokenJti,
      tokenHash: hashToken(tokenPair.refreshToken),
      expiresAt: tokenPair.refreshTokenExpiresAt,
      ipAddress: meta.ipAddress ?? undefined,
      userAgent: meta.userAgent ?? undefined,
    },
  });

  return tokenPair;
}

export async function registerUser(input: unknown, meta: AuthRequestMeta) {
  const parsed = signupSchema.parse(input);
  const passwordHash = await hashPassword(parsed.password);

  const user = await prisma.$transaction(async (tx: any) => {
    return tx.user.create({
      data: {
        email: parsed.email,
        passwordHash,
        firstName: parsed.firstName,
        lastName: parsed.lastName,
        phone: parsed.phone,
        role: parsed.role,
        isEmailVerified: false,
        vendorProfile:
          parsed.role === 'VENDOR'
            ? {
                create: {
                  storeName: parsed.storeName?.trim() ?? `Vendor-${randomUUID().slice(0, 8)}`,
                  verificationStatus: VendorStatus.PENDING_VERIFICATION,
                },
              }
            : undefined,
      },
      include: {
        vendorProfile: true,
      },
    });
  });

  const tokenPair = await issueTokensAndStoreSession(
    {
      id: user.id,
      email: user.email,
      role: user.role as UserRole,
    },
    meta,
  );

  await prisma.user.update({
    where: { id: user.id },
    data: {
      lastLoginAt: new Date(),
      lastLoginIP: meta.ipAddress ?? undefined,
    },
  });

  return {
    user: toPublicUser(user),
    tokenPair,
  };
}

export async function loginUser(input: unknown, meta: AuthRequestMeta) {
  const parsed = loginSchema.parse(input);

  const user = await prisma.user.findUnique({
    where: { email: parsed.email },
    include: { vendorProfile: true },
  });

  if (!user || user.deletedAt || !user.passwordHash) {
    throw new Error('Invalid email or password');
  }

  if (!user.isActive) {
    throw new Error('Account is suspended or inactive');
  }

  const isPasswordValid = await verifyPassword(parsed.password, user.passwordHash);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  if (user.role === UserRole.VENDOR && user.vendorProfile?.verificationStatus === VendorStatus.REJECTED) {
    throw new Error('Vendor account was rejected');
  }

  const tokenPair = await issueTokensAndStoreSession(
    {
      id: user.id,
      email: user.email,
      role: user.role as UserRole,
    },
    meta,
    parsed.rememberMe,
  );

  await prisma.user.update({
    where: { id: user.id },
    data: {
      lastLoginAt: new Date(),
      lastLoginIP: meta.ipAddress ?? undefined,
    },
  });

  return {
    user: toPublicUser(user),
    tokenPair,
  };
}

export async function signInOAuthUser(input: OAuthProfileInput, meta: AuthRequestMeta) {
  const email = input.email.trim().toLowerCase();
  const existingUser = await prisma.user.findUnique({
    where: { email },
    include: { vendorProfile: true },
  });

  if (existingUser && (existingUser.deletedAt || !existingUser.isActive)) {
    throw new Error('Account is suspended or inactive');
  }

  const user = existingUser
    ? await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          firstName: existingUser.firstName ?? input.firstName?.trim() ?? null,
          lastName: existingUser.lastName ?? input.lastName?.trim() ?? null,
          avatar: input.avatar ?? existingUser.avatar,
          isEmailVerified: true,
          lastLoginAt: new Date(),
          lastLoginIP: meta.ipAddress ?? undefined,
        },
        include: { vendorProfile: true },
      })
    : await prisma.user.create({
        data: {
          email,
          passwordHash: null,
          role: input.role ?? UserRole.CUSTOMER,
          firstName: input.firstName?.trim() ?? null,
          lastName: input.lastName?.trim() ?? null,
          avatar: input.avatar ?? null,
          isEmailVerified: true,
          lastLoginAt: new Date(),
          lastLoginIP: meta.ipAddress ?? undefined,
        },
        include: { vendorProfile: true },
      });

  const tokenPair = await issueTokensAndStoreSession(
    {
      id: user.id,
      email: user.email,
      role: user.role as UserRole,
    },
    meta,
  );

  return {
    user: toPublicUser(user),
    tokenPair,
  };
}

export async function refreshAuthSession(input: unknown, meta: AuthRequestMeta) {
  const parsed = refreshTokenSchema.parse(input);
  const payload = await verifyRefreshToken(parsed.refreshToken);
  const tokenHash = hashToken(parsed.refreshToken);

  const storedToken = await prisma.refreshToken.findUnique({
    where: { jti: payload.jti },
    include: { user: { include: { vendorProfile: true } } },
  });

  if (!storedToken || storedToken.revokedAt || storedToken.expiresAt < new Date() || storedToken.tokenHash !== tokenHash) {
    throw new Error('Invalid refresh token');
  }

  const newTokenPair = await issueTokensAndStoreSession(
    {
      id: storedToken.user.id,
      email: storedToken.user.email,
      role: storedToken.user.role as UserRole,
    },
    meta,
  );

  await prisma.refreshToken.update({
    where: { jti: payload.jti },
    data: {
      revokedAt: new Date(),
      replacedByJti: newTokenPair.refreshTokenJti,
    },
  });

  return {
    user: toPublicUser(storedToken.user),
    tokenPair: newTokenPair,
  };
}

export async function logoutUser(input: unknown) {
  const parsed = refreshTokenSchema.parse(input);
  const payload = await verifyRefreshToken(parsed.refreshToken).catch(() => null);

  if (!payload) {
    return { success: true };
  }

  await prisma.refreshToken.updateMany({
    where: {
      jti: payload.jti,
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
    },
  });

  return { success: true };
}

export async function getCurrentUserFromPayload(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { vendorProfile: true },
  });

  if (!user || user.deletedAt || !user.isActive) {
    throw new Error('User not found');
  }

  return toPublicUser(user);
}

export async function requestPasswordReset(input: unknown, meta: AuthRequestMeta) {
  const parsed = forgotPasswordSchema.parse(input);
  const user = await prisma.user.findUnique({
    where: { email: parsed.email },
  });

  if (!user || user.deletedAt || !user.isActive) {
    return {
      resetToken: null,
      devOnly: false,
    };
  }

  const resetToken = createResetToken();
  const tokenHash = hashResetToken(resetToken);

  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      tokenHash,
      expiresAt: getResetTokenExpiry(),
    },
  });

  return {
    resetToken: process.env.NODE_ENV === 'production' ? null : resetToken,
    devOnly: process.env.NODE_ENV !== 'production',
    meta,
  };
}

export async function resetPassword(input: unknown) {
  const parsed = resetPasswordSchema.parse(input);
  const tokenHash = hashResetToken(parsed.token);

  const passwordResetToken = await prisma.passwordResetToken.findFirst({
    where: {
      tokenHash,
      usedAt: null,
      expiresAt: {
        gt: new Date(),
      },
    },
    include: {
      user: true,
    },
  });

  if (!passwordResetToken || passwordResetToken.user.deletedAt || !passwordResetToken.user.isActive) {
    throw new Error('Invalid or expired reset token');
  }

  const nextPasswordHash = await hashPassword(parsed.password);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: passwordResetToken.userId },
      data: { passwordHash: nextPasswordHash },
    }),
    prisma.passwordResetToken.update({
      where: { id: passwordResetToken.id },
      data: { usedAt: new Date() },
    }),
    prisma.refreshToken.updateMany({
      where: { userId: passwordResetToken.userId },
      data: { revokedAt: new Date() },
    }),
  ]);

  return {
    success: true,
  };
}

export function buildAuthError(error: unknown) {
  if (error && typeof error === 'object' && 'code' in error) {
    const code = (error as { code?: string }).code;
    if (code === 'P2002') {
      return new Error('Email or store name already exists');
    }
  }

  if (error instanceof Error) {
    return error;
  }

  return new Error('An unexpected authentication error occurred');
}
