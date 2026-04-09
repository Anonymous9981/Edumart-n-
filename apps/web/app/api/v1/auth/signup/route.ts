import { NextRequest } from 'next/server';

import { errorResponse, successResponse } from '../../../../../lib/response';
import { buildAuthError, registerUser } from '../../../../../lib/auth-service';
import { setAuthCookies } from '../../../../../lib/auth';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await registerUser(body, {
      ipAddress:
        request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
        request.headers.get('x-real-ip') ??
        null,
      userAgent: request.headers.get('user-agent'),
    });

    const response = successResponse({
      user: result.user,
      accessToken: result.tokenPair.accessToken,
      refreshToken: result.tokenPair.refreshToken,
    }, { status: 201 });

    setAuthCookies(response, result.tokenPair);
    return response;
  } catch (error) {
    const authError = buildAuthError(error);
    return errorResponse(authError.message, authError.message === 'Email or store name already exists' ? 409 : 400);
  }
}
