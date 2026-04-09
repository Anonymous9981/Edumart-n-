import { NextRequest } from 'next/server';

import { errorResponse, successResponse } from '../../../../../lib/response';
import { getTokenFromRequest, verifyAccessToken } from '../../../../../lib/auth';
import { getCurrentUserFromPayload } from '../../../../../lib/auth-service';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return errorResponse('Unauthorized', 401);
    }

    const payload = await verifyAccessToken(token);
    const user = await getCurrentUserFromPayload(payload.sub);

    return successResponse({ user });
  } catch {
    return errorResponse('Unauthorized', 401);
  }
}
