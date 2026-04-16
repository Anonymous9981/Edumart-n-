import { NextRequest } from 'next/server'

import { UserRole } from '@edumart/shared'

import { errorResponse, successResponse } from '../../../../../lib/response'
import { createRouteClient } from '../../../../../lib/supabase/middleware'
import { syncAppUserFromSupabaseUser } from '../../../../../lib/supabase/auth-route'
import { applyRateLimit, getClientIp } from '../../../../../lib/rate-limit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const ip = getClientIp(request.headers)
  const rate = applyRateLimit({
    key: `auth:select-role:${ip}`,
    maxRequests: 10,
    windowMs: 60_000,
  })

  if (!rate.ok) {
    return errorResponse('Too many role selection attempts. Please wait and try again.', 429)
  }

  try {
    const body = await request.json()
    const roleCandidate = String(body?.role ?? '').toUpperCase()
    const parsedRole = roleCandidate === UserRole.VENDOR ? UserRole.VENDOR : UserRole.CUSTOMER
    const normalizedRole = parsedRole.toLowerCase()
    const storeName = String(body?.storeName ?? '').trim()

    if (parsedRole === UserRole.VENDOR && !storeName) {
      return errorResponse('Store name is required for vendor role', 400)
    }

    const { supabase, applyCookies } = createRouteClient(request)
    const { data, error } = await supabase.auth.getUser()

    if (error || !data.user) {
      return errorResponse('Unauthorized', 401)
    }

    const metadata = {
      ...data.user.user_metadata,
      role: normalizedRole,
    }

    const { error: updateError } = await supabase.auth.updateUser({ data: metadata })
    if (updateError) {
      throw updateError
    }

    const appUser = await syncAppUserFromSupabaseUser({
      id: data.user.id,
      email: data.user.email ?? '',
      role: parsedRole,
      firstName: data.user.user_metadata?.first_name ?? data.user.user_metadata?.given_name ?? null,
      lastName: data.user.user_metadata?.last_name ?? data.user.user_metadata?.family_name ?? null,
      avatar: data.user.user_metadata?.avatar_url ?? data.user.user_metadata?.picture ?? null,
      phone: data.user.user_metadata?.phone ?? null,
      storeName: parsedRole === UserRole.VENDOR ? storeName : null,
      isEmailVerified: Boolean(data.user.email_confirmed_at),
      ipAddress:
        request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
        request.headers.get('x-real-ip') ??
        null,
    })

    const response = successResponse({ user: appUser })
    return applyCookies(response)
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : 'Unable to select role', 400)
  }
}
