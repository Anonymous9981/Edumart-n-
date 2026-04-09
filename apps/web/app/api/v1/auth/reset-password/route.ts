import { NextRequest } from 'next/server';

import { errorResponse, successResponse } from '../../../../../lib/response';
import { resetPassword } from '../../../../../lib/auth-service';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    await resetPassword(body);

    return successResponse({
      message: 'Password updated successfully',
    });
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : 'Unable to reset password', 400);
  }
}
