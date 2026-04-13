import { NextRequest } from 'next/server';

import { errorResponse, successResponse } from '../../../../../lib/response';
import { createRouteClient } from '../../../../../lib/supabase/middleware';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { supabase, applyCookies } = createRouteClient(request)
    const { error } = await supabase.auth.signOut()

    if (error) {
      throw error
    }

    const response = successResponse({ loggedOut: true })
    return applyCookies(response)
  } catch {
    return errorResponse('Unable to sign out', 400)
  }
}
