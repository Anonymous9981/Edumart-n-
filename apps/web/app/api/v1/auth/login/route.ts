import { NextRequest } from 'next/server';

import { errorResponse, successResponse } from '../../../../../lib/response';
import { buildAuthError, getCurrentUserFromPayload } from '../../../../../lib/auth-service';
import { createRouteClient } from '../../../../../lib/supabase/middleware';
import { isPrismaDatabaseError, syncAppUserFromSupabaseUser } from '../../../../../lib/supabase/auth-route';
import { prisma } from '../../../../../lib/prisma';
import { verifyPassword } from '../../../../../lib/auth';
import { UserRole } from '@edumart/shared';
import { ensureConfirmedAuthUser, isConfirmationDeliveryError } from '../../../../../lib/supabase/admin-auth';
import { applyRateLimit, getClientIp } from '../../../../../lib/rate-limit';
import { AccountStatus } from '@edumart/shared';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function normalizeRoleMetadata(role: string) {
  if (role === UserRole.ADMIN) {
    return 'admin';
  }

  if (role === UserRole.VENDOR) {
    return 'vendor';
  }

  return 'customer';
}

async function getValidLocalUser(email: string, password: string) {
  let user = null;

  try {
    user = await prisma.user.findUnique({
      where: { email },
    });
  } catch (error) {
    if (isPrismaDatabaseError(error)) {
      return null;
    }

    throw error;
  }

  if (!user || user.deletedAt || !user.isActive || user.accountStatus !== AccountStatus.ACTIVE || !user.passwordHash) {
    return null;
  }

  const validPassword = await verifyPassword(password, user.passwordHash);
  if (!validPassword) {
    return null;
  }

  return user;
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request.headers)
    const rate = applyRateLimit({
      key: `auth:login:${ip}`,
      maxRequests: 8,
      windowMs: 60_000,
    })

    if (!rate.ok) {
      return errorResponse('Too many login attempts. Please wait and try again.', 429)
    }

    const body = await request.json();
    const email = String(body?.email ?? '').trim().toLowerCase();
    const password = String(body?.password ?? '');
    const { supabase, applyCookies } = createRouteClient(request);

    let { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      const localUser = await getValidLocalUser(email, password);

      if (localUser) {
        const metadata = {
          role: normalizeRoleMetadata(localUser.role),
          first_name: localUser.firstName ?? '',
          last_name: localUser.lastName ?? '',
          phone: localUser.phone ?? '',
        };

        const signUpResult = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: metadata,
          },
        });

        if (signUpResult.error && !/already|registered|exists/i.test(signUpResult.error.message)) {
          if (!isConfirmationDeliveryError(signUpResult.error.message)) {
            throw signUpResult.error;
          }

          const ensured = await ensureConfirmedAuthUser({ email, password, metadata });
          if (!ensured) {
            throw new Error(
              'Email confirmation service is unavailable. Set SUPABASE_SERVICE_ROLE_KEY to auto-confirm users or enable SMTP in Supabase Auth.',
            );
          }
        }

        const retry = await supabase.auth.signInWithPassword({ email, password });
        data = retry.data;
        error = retry.error;
      }
    }

    if (error || !data.user) {
      throw error ?? new Error('Invalid email or password');
    }

    const appUser = await syncAppUserFromSupabaseUser({
      id: data.user.id,
      email: data.user.email ?? String(body?.email ?? '').trim().toLowerCase(),
      role: undefined,
      firstName: data.user.user_metadata?.first_name ?? null,
      lastName: data.user.user_metadata?.last_name ?? null,
      phone: data.user.user_metadata?.phone ?? null,
      isEmailVerified: Boolean(data.user.email_confirmed_at),
      ipAddress:
        request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
        request.headers.get('x-real-ip') ??
        null,
    });

    if (!appUser || appUser.deletedAt || !appUser.isActive || appUser.accountStatus !== AccountStatus.ACTIVE) {
      await supabase.auth.signOut()
      return errorResponse('Account is not active. Please contact support.', 403)
    }

    if (appUser?.role && data.user.user_metadata?.role !== normalizeRoleMetadata(appUser.role as UserRole)) {
      await supabase.auth.updateUser({
        data: {
          role: normalizeRoleMetadata(appUser.role as UserRole),
        },
      })
    }

    const response = successResponse({
      user: appUser ?? (await getCurrentUserFromPayload(data.user.id)),
      accessToken: data.session?.access_token ?? null,
      refreshToken: data.session?.refresh_token ?? null,
    });

    return applyCookies(response);
  } catch (error) {
    const authError = buildAuthError(error);
    return errorResponse(authError.message, 401);
  }
}
