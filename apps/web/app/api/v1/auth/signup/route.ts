import { NextRequest } from 'next/server';

import { UserRole } from '@edumart/shared';

import { errorResponse, successResponse } from '../../../../../lib/response';
import { createRouteClient } from '../../../../../lib/supabase/middleware';
import { syncAppUserFromSupabaseUser } from '../../../../../lib/supabase/auth-route';
import { buildAuthError } from '../../../../../lib/auth-service';
import { ensureConfirmedAuthUser, isConfirmationDeliveryError } from '../../../../../lib/supabase/admin-auth';
import { applyRateLimit, getClientIp } from '../../../../../lib/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request.headers)
    const rate = applyRateLimit({
      key: `auth:signup:${ip}`,
      maxRequests: 6,
      windowMs: 60_000,
    })

    if (!rate.ok) {
      return errorResponse('Too many signup attempts. Please wait and try again.', 429)
    }

    const body = await request.json();
    const { supabase, applyCookies } = createRouteClient(request);

    const roleCandidate = String(body?.role ?? UserRole.CUSTOMER).toUpperCase();
    const parsedRole =
      roleCandidate === UserRole.VENDOR || roleCandidate === UserRole.CUSTOMER
        ? (roleCandidate as UserRole)
        : UserRole.CUSTOMER;
    const normalizedRole = parsedRole.toLowerCase();
    const email = String(body?.email ?? '').trim().toLowerCase();
    const password = String(body?.password ?? '');

    let { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: normalizedRole,
          first_name: String(body?.firstName ?? '').trim(),
          last_name: String(body?.lastName ?? '').trim(),
          phone: String(body?.phone ?? '').trim(),
        },
      },
    });

    if ((error || !data.user) && isConfirmationDeliveryError(error?.message)) {
      const ensured = await ensureConfirmedAuthUser({
        email,
        password,
        metadata: {
          role: normalizedRole,
          first_name: String(body?.firstName ?? '').trim(),
          last_name: String(body?.lastName ?? '').trim(),
          phone: String(body?.phone ?? '').trim(),
        },
      });

      if (!ensured) {
        throw new Error(
          'Email confirmation service is unavailable. Set SUPABASE_SERVICE_ROLE_KEY to auto-confirm users or enable SMTP in Supabase Auth.',
        );
      }

      const retry = await supabase.auth.signInWithPassword({ email, password });
      data = retry.data;
      error = retry.error;
    }

    if (error || !data.user) {
      throw error ?? new Error('Unable to create account');
    }

    const appUser = await syncAppUserFromSupabaseUser({
      id: data.user.id,
      email: data.user.email ?? String(body?.email ?? '').trim().toLowerCase(),
      role: parsedRole,
      firstName: String(body?.firstName ?? '').trim() || null,
      lastName: String(body?.lastName ?? '').trim() || null,
      phone: String(body?.phone ?? '').trim() || null,
      storeName: String(body?.storeName ?? '').trim() || null,
      isEmailVerified: Boolean(data.user.email_confirmed_at ?? data.session),
      ipAddress:
        request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
        request.headers.get('x-real-ip') ??
        null,
    });

    const response = successResponse(
      {
        user: appUser,
        accessToken: data.session?.access_token ?? null,
        refreshToken: data.session?.refresh_token ?? null,
      },
      { status: 201 },
    );

    return applyCookies(response);
  } catch (error) {
    const authError = buildAuthError(error);
    return errorResponse(authError.message, authError.message === 'Email or store name already exists' ? 409 : 400);
  }
}
