import { NextRequest, NextResponse } from 'next/server';

/**
 * Health check endpoint
 * GET /api/v1/health
 */
export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    data: {
      status: 'ok',
      timestamp: new Date().toISOString(),
    },
  });
}
