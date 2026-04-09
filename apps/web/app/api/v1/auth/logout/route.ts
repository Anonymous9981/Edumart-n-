import { NextRequest } from 'next/server';

import { clearAuthCookies, AUTH_COOKIE_NAMES } from '../../../../../lib/auth';
import { errorResponse, successResponse } from '../../../../../lib/response';
import { logoutUser } from '../../../../../lib/auth-service';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as { refreshToken?: string };
    const refreshToken = body.refreshToken || request.cookies.get(AUTH_COOKIE_NAMES.refreshToken)?.value;

    if (refreshToken) {
      await logoutUser({ refreshToken });
    }

    const response = successResponse({ loggedOut: true });
    clearAuthCookies(response);
    return response;
  } catch {
    const response = errorResponse('Unable to sign out', 400);
    clearAuthCookies(response);
    return response;
  }
}
