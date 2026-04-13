import { NextRequest } from 'next/server';

import { UserRole } from '@edumart/shared';

import { errorResponse, successResponse } from '../../../../../lib/response';
import { createRouteClient } from '../../../../../lib/supabase/middleware';
import { syncAppUserFromSupabaseUser } from '../../../../../lib/supabase/auth-route';
import { buildAuthError } from '../../../../../lib/auth-service';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { supabase, applyCookies } = createRouteClient(request);

    const parsedRole = String(body?.role ?? UserRole.CUSTOMER).toUpperCase() as UserRole;
    const { data, error } = await supabase.auth.signUp({
      email: String(body?.email ?? '').trim().toLowerCase(),
      password: String(body?.password ?? ''),
      options: {
        data: {
          role: parsedRole,
          first_name: String(body?.firstName ?? '').trim(),
          last_name: String(body?.lastName ?? '').trim(),
          phone: String(body?.phone ?? '').trim(),
        },
      },
    });

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
