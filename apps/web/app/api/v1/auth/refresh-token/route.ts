import { NextRequest } from 'next/server';

import { errorResponse, successResponse } from '../../../../../lib/response';
import { buildAuthError, refreshAuthSession } from '../../../../../lib/auth-service';
import { AUTH_COOKIE_NAMES, clearAuthCookies, setAuthCookies } from '../../../../../lib/auth';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as { refreshToken?: string };
    const refreshToken = body.refreshToken || request.cookies.get(AUTH_COOKIE_NAMES.refreshToken)?.value;

    if (!refreshToken) {
      return errorResponse('Refresh token is required', 400);
    }

    const result = await refreshAuthSession(
      { refreshToken },
      {
        ipAddress:
          request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
          request.headers.get('x-real-ip') ??
          null,
        userAgent: request.headers.get('user-agent'),
      },
    );

    const response = successResponse({
      user: result.user,
      accessToken: result.tokenPair.accessToken,
      refreshToken: result.tokenPair.refreshToken,
    });

    setAuthCookies(response, result.tokenPair);
    return response;
  } catch (error) {
    const response = errorResponse(buildAuthError(error).message, 401);
    clearAuthCookies(response);
    return response;
  }
}
