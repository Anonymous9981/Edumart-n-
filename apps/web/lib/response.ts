import { NextResponse } from 'next/server';

import type { ApiResponse } from '@edumart/shared';

export function successResponse<T>(data: T, init?: ResponseInit) {
  return NextResponse.json<ApiResponse<T>>(
    {
      success: true,
      data,
    },
    init,
  );
}

export function paginatedResponse<T>(
  data: T,
  meta: NonNullable<ApiResponse['meta']>,
  init?: ResponseInit,
) {
  return NextResponse.json<ApiResponse<T>>(
    {
      success: true,
      data,
      meta,
    },
    init,
  );
}

export function errorResponse(
  message: string,
  status = 400,
  code = 'REQUEST_ERROR',
  details?: Record<string, unknown>,
) {
  return NextResponse.json<ApiResponse>({
    success: false,
    error: {
      code,
      message,
      details,
    },
  }, { status });
}
