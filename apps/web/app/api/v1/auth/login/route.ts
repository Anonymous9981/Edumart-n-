import { NextRequest } from 'next/server';

import { errorResponse, successResponse } from '../../../../../lib/response';
import { buildAuthError, getCurrentUserFromPayload } from '../../../../../lib/auth-service';
import { createRouteClient } from '../../../../../lib/supabase/middleware';
import { syncAppUserFromSupabaseUser } from '../../../../../lib/supabase/auth-route';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { supabase, applyCookies } = createRouteClient(request);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: String(body?.email ?? '').trim().toLowerCase(),
      password: String(body?.password ?? ''),
    });

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
