import crypto from 'crypto';

import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify, type JWTPayload as JoseJWTPayload } from 'jose';
import { NextRequest, NextResponse } from 'next/server';

import { UserRole } from '@edumart/shared';

import { ROLE_DASHBOARD_PATHS } from '../constants/roles';

const ACCESS_TOKEN_COOKIE = 'edumart_access_token';
const REFRESH_TOKEN_COOKIE = 'edumart_refresh_token';
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;

export const AUTH_COOKIE_NAMES = {
  accessToken: ACCESS_TOKEN_COOKIE,
  refreshToken: REFRESH_TOKEN_COOKIE,
};

export interface AuthTokenPayload extends JoseJWTPayload {
  sub: string;
  email: string;
  role: UserRole;
  type: 'access' | 'refresh';
  jti: string;
}

interface TokenClaimInput {
  sub: string;
  email: string;
  role: UserRole;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRole;
  firstName?: string | null;
  lastName?: string | null;
  avatar?: string | null;
  phone?: string | null;
  isActive: boolean;
  isEmailVerified: boolean;
  vendorProfile?: {
    id: string;
    storeName: string;
    verificationStatus: string;
    rating: number | null;
    reviewCount: number;
  } | null;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: Date;
  refreshTokenExpiresAt: Date;
  refreshTokenJti: string;
}

function getJwtSecret(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return new TextEncoder().encode(value);
}

function getAccessTokenExpiry() {
  return process.env.JWT_EXPIRES_IN ?? '1h';
}

function getRefreshTokenExpiry(rememberMe = false) {
  if (rememberMe) {
    return process.env.JWT_REFRESH_EXPIRES_IN ?? '30d';
  }
  return process.env.JWT_REFRESH_EXPIRES_IN ?? '7d';
}

export function hashToken(token: string) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function generateTokenId() {
  return crypto.randomUUID();
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash);
}

export async function createAccessToken(payload: TokenClaimInput) {
  const jti = generateTokenId();
  const token = await new SignJWT({
    email: payload.email,
    role: payload.role,
    type: 'access',
    jti,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(getAccessTokenExpiry())
    .sign(getJwtSecret('JWT_SECRET'));

  return { token, jti };
}

export async function createRefreshToken(payload: TokenClaimInput, rememberMe = false) {
  const jti = generateTokenId();
  const token = await new SignJWT({
    email: payload.email,
    role: payload.role,
    type: 'refresh',
    jti,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(getRefreshTokenExpiry(rememberMe))
    .sign(getJwtSecret('JWT_REFRESH_SECRET'));

  return { token, jti };
}

export async function verifyAccessToken(token: string) {
  const { payload } = await jwtVerify<AuthTokenPayload>(token, getJwtSecret('JWT_SECRET'));
  if (payload.type !== 'access') {
    throw new Error('Invalid access token');
  }
  return payload;
}

export async function verifyRefreshToken(token: string) {
  const { payload } = await jwtVerify<AuthTokenPayload>(token, getJwtSecret('JWT_REFRESH_SECRET'));
  if (payload.type !== 'refresh') {
    throw new Error('Invalid refresh token');
  }
  return payload;
}

export async function createTokenPair(
  user: { id: string; email: string; role: UserRole },
  rememberMe = false,
): Promise<TokenPair> {
  const { token: accessToken } = await createAccessToken({
    sub: user.id,
    email: user.email,
    role: user.role,
  });

  const { token: refreshToken, jti: refreshTokenJti } = await createRefreshToken(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
    },
    rememberMe,
  );

  const accessTokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000);
  const refreshTokenExpiresAt = new Date(
    Date.now() + (rememberMe ? 30 : 7) * 24 * 60 * 60 * 1000,
  );

  return {
    accessToken,
    refreshToken,
    accessTokenExpiresAt,
    refreshTokenExpiresAt,
    refreshTokenJti,
  };
}

export function setAuthCookies(response: NextResponse, tokenPair: TokenPair) {
  const secure = process.env.NODE_ENV === 'production';

  response.cookies.set(AUTH_COOKIE_NAMES.accessToken, tokenPair.accessToken, {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    path: '/',
    expires: tokenPair.accessTokenExpiresAt,
  });

  response.cookies.set(AUTH_COOKIE_NAMES.refreshToken, tokenPair.refreshToken, {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    path: '/',
    expires: tokenPair.refreshTokenExpiresAt,
  });

  return response;
}

export function clearAuthCookies(response: NextResponse) {
  response.cookies.set(AUTH_COOKIE_NAMES.accessToken, '', {
    httpOnly: true,
    path: '/',
    expires: new Date(0),
  });
  response.cookies.set(AUTH_COOKIE_NAMES.refreshToken, '', {
    httpOnly: true,
    path: '/',
    expires: new Date(0),
  });

  return response;
}

export function getTokenFromRequest(request: NextRequest, cookieName = AUTH_COOKIE_NAMES.accessToken) {
  const cookieToken = request.cookies.get(cookieName)?.value;
  if (cookieToken) {
    return cookieToken;
  }

  const authorization = request.headers.get('authorization');
  if (!authorization?.startsWith('Bearer ')) {
    return null;
  }

  return authorization.slice(7).trim();
}

export function getDashboardPath(role: UserRole) {
  return ROLE_DASHBOARD_PATHS[role];
}

export function createResetToken() {
  return crypto.randomBytes(32).toString('hex');
}

export function hashResetToken(token: string) {
  return hashToken(token);
}

export function getResetTokenExpiry() {
  return new Date(Date.now() + RESET_TOKEN_TTL_MS);
}
