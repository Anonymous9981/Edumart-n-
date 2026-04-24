import { NextRequest } from 'next/server';

import { UserRole } from '@edumart/shared';
import { errorResponse, successResponse } from '../../../../../lib/response';
import { enforceApiRateLimit } from '../../../../../lib/api-rate-limit';
import { createRouteClient } from '../../../../../lib/supabase/middleware';
import { findAppUserForSupabaseUser } from '../../../../../lib/supabase/auth-route';
import { AccountStatus } from '@edumart/shared';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function normalizeRole(value: unknown): UserRole {
  const normalized = String(value ?? '').trim().toUpperCase()
  if (normalized === UserRole.ADMIN) {
    return UserRole.ADMIN
  }

  if (normalized === UserRole.VENDOR) {
    return UserRole.VENDOR
  }

  return UserRole.CUSTOMER
}

function normalizeAccountStatus(value: unknown): AccountStatus {
  const normalized = String(value ?? '').trim().toUpperCase()
  if (normalized === AccountStatus.SUSPENDED) {
    return AccountStatus.SUSPENDED
  }

  if (normalized === AccountStatus.PENDING) {
    return AccountStatus.PENDING
  }

  return AccountStatus.ACTIVE
}

export async function GET(request: NextRequest) {
  const limited = enforceApiRateLimit(request, { scope: 'auth:me', maxRequests: 90, windowMs: 60_000 })
  if (limited) {
    return limited
  }

  try {
    const { supabase } = createRouteClient(request)
    const { data, error } = await supabase.auth.getUser()

    if (error || !data.user) {
      return errorResponse('Unauthorized', 401);
    }

    let user = null
    try {
      user = await findAppUserForSupabaseUser({
        id: data.user.id,
        email: data.user.email,
      });
    } catch {
      user = null
    }

    if (user) {
      if (user.deletedAt || !user.isActive || user.accountStatus !== AccountStatus.ACTIVE) {
        return errorResponse('Unauthorized', 401)
      }

      return successResponse({ user })
    }

    // Fallback: when app DB is unavailable, rely on Supabase metadata to keep auth/session UX functional.
    const metadata = data.user.user_metadata as Record<string, unknown> | undefined
    const appMetadata = data.user.app_metadata as Record<string, unknown> | undefined

    const fallbackUser = {
      id: data.user.id,
      email: data.user.email ?? '',
      role: normalizeRole(appMetadata?.role ?? metadata?.role),
      accountStatus: normalizeAccountStatus(appMetadata?.accountStatus ?? metadata?.accountStatus),
      firstName: String(metadata?.first_name ?? metadata?.given_name ?? '') || null,
      lastName: String(metadata?.last_name ?? metadata?.family_name ?? '') || null,
      avatar: String(metadata?.avatar_url ?? metadata?.picture ?? '') || null,
      phone: String(metadata?.phone ?? '') || null,
      isActive: true,
      isEmailVerified: Boolean(data.user.email_confirmed_at),
      deletedAt: null,
    }

    if (fallbackUser.accountStatus !== AccountStatus.ACTIVE) {
      return errorResponse('Unauthorized', 401)
    }

    return successResponse({ user: fallbackUser });
  } catch {
    return errorResponse('Unauthorized', 401);
  }
}
