import { NextRequest } from 'next/server';

import { errorResponse, successResponse } from '../../../../../lib/response';
import { buildAuthError, getCurrentUserFromPayload } from '../../../../../lib/auth-service';
import { createRouteClient } from '../../../../../lib/supabase/middleware';
import { syncAppUserFromSupabaseUser } from '../../../../../lib/supabase/auth-route';
import { applyRateLimit, getClientIp } from '../../../../../lib/rate-limit';
import { AccountStatus } from '@edumart/shared';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request.headers)
    const rate = applyRateLimit({
      key: `auth:refresh:${ip}`,
      maxRequests: 20,
      windowMs: 60_000,
    })

    if (!rate.ok) {
      return errorResponse('Too many refresh attempts. Please wait and try again.', 429)
    }

    const { supabase, applyCookies } = createRouteClient(request);
    const { data, error } = await supabase.auth.refreshSession();

    if (error || !data.session || !data.user) {
      throw error ?? new Error('Unable to refresh session');
    }

    const appUser = await syncAppUserFromSupabaseUser({
      id: data.user.id,
      email: data.user.email ?? '',
      firstName: data.user.user_metadata?.first_name ?? null,
      lastName: data.user.user_metadata?.last_name ?? null,
      avatar: data.user.user_metadata?.avatar_url ?? null,
      phone: data.user.user_metadata?.phone ?? null,
      isEmailVerified: Boolean(data.user.email_confirmed_at),
      ipAddress:
        request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
        request.headers.get('x-real-ip') ??
        null,
    })

    if (!appUser || appUser.deletedAt || !appUser.isActive || appUser.accountStatus !== AccountStatus.ACTIVE) {
      await supabase.auth.signOut()
      return errorResponse('Account is not active. Please contact support.', 403)
    }

    const response = successResponse({
      user: appUser ?? (await getCurrentUserFromPayload(data.user.id)),
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
    })

    return applyCookies(response)
  } catch (error) {
    return errorResponse(buildAuthError(error).message, 401)
  }
}
