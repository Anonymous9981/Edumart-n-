import { NextRequest } from 'next/server';

import { errorResponse, successResponse } from '../../../../../lib/response';
import { createRouteClient } from '../../../../../lib/supabase/middleware';
import { findAppUserForSupabaseUser } from '../../../../../lib/supabase/auth-route';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { supabase } = createRouteClient(request)
    const { data, error } = await supabase.auth.getUser()

    if (error || !data.user) {
      return errorResponse('Unauthorized', 401);
    }

    const user = await findAppUserForSupabaseUser({
      id: data.user.id,
      email: data.user.email,
    });

    if (!user || user.deletedAt || !user.isActive) {
      return errorResponse('Unauthorized', 401);
    }

    return successResponse({ user });
  } catch {
    return errorResponse('Unauthorized', 401);
  }
}
