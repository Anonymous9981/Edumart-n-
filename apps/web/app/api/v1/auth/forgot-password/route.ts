import { NextRequest } from 'next/server';

import { errorResponse, successResponse } from '../../../../../lib/response';
import { requestPasswordReset } from '../../../../../lib/auth-service';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await requestPasswordReset(body, {
      ipAddress:
        request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
        request.headers.get('x-real-ip') ??
        null,
      userAgent: request.headers.get('user-agent'),
    });

    return successResponse({
      message: 'If the account exists, a reset link will be sent shortly.',
      resetToken: result.resetToken,
      devOnly: result.devOnly,
    });
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : 'Unable to request password reset', 400);
  }
}
