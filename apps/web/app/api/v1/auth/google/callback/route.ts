import { NextRequest, NextResponse } from 'next/server';

import { UserRole } from '@edumart/shared';

import { getDashboardPath } from '../../../../../../lib/auth';
import { buildAuthError } from '../../../../../../lib/auth-service';
import { createRouteClient } from '../../../../../../lib/supabase/middleware';
import { syncAppUserFromSupabaseUser } from '../../../../../../lib/supabase/auth-route';

function normalizeReturnTo(value: string | null) {
  if (!value || !value.startsWith('/') || value.startsWith('//')) {
    return getDashboardPath(UserRole.CUSTOMER);
  }

  return value;
}

function redirectWithError(request: NextRequest, message: string) {
  return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(message)}`, request.url));
}

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const code = request.nextUrl.searchParams.get('code');
    const returnTo = normalizeReturnTo(request.nextUrl.searchParams.get('returnTo'));

    if (!code) {
      return redirectWithError(request, 'google-auth-invalid-state');
    }

    const { supabase, applyCookies } = createRouteClient(request);
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error || !data.user) {
      throw error ?? new Error('Unable to complete Google sign-in');
    }

    const user = data.user;
    const profile = user.user_metadata ?? {};

    await syncAppUserFromSupabaseUser({
      id: user.id,
      email: user.email ?? '',
      role: UserRole.CUSTOMER,
      firstName: profile.first_name ?? profile.given_name ?? null,
      lastName: profile.last_name ?? profile.family_name ?? null,
      avatar: profile.avatar_url ?? profile.picture ?? null,
      phone: profile.phone ?? null,
      isEmailVerified: true,
      ipAddress:
        request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
        request.headers.get('x-real-ip') ??
        null,
    });

    const response = NextResponse.redirect(new URL(returnTo, request.url));
    return applyCookies(response);
  } catch (error) {
    const authError = buildAuthError(error);
    return redirectWithError(request, authError.message);
  }
}
