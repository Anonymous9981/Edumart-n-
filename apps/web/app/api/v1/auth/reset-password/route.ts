import { NextRequest } from 'next/server';

import { errorResponse, successResponse } from '../../../../../lib/response';
import { buildAuthError } from '../../../../../lib/auth-service';
import { createRouteClient } from '../../../../../lib/supabase/middleware';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const password = String(body?.password ?? '')
    const confirmPassword = String(body?.confirmPassword ?? '')

    if (password !== confirmPassword) {
      return errorResponse('Passwords do not match', 400)
    }

    const { supabase } = createRouteClient(request)
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      throw error
    }

    return successResponse({
      message: 'Password updated successfully',
    });
  } catch (error) {
    return errorResponse(buildAuthError(error).message || 'Unable to reset password', 400);
  }
}
