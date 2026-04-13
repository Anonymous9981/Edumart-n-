import { NextRequest } from 'next/server';

import { errorResponse, successResponse } from '../../../../../lib/response';
import { buildAuthError } from '../../../../../lib/auth-service';
import { createRouteClient } from '../../../../../lib/supabase/middleware';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const email = String(body?.email ?? '').trim().toLowerCase()
    const { supabase } = createRouteClient(request)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: new URL('/reset-password', request.url).toString(),
    })

    if (error) {
      throw error
    }

    return successResponse({
      message: 'If the account exists, a reset link will be sent shortly.',
    });
  } catch (error) {
    return errorResponse(buildAuthError(error).message || 'Unable to request password reset', 400);
  }
}
