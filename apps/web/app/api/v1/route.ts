import { NextRequest, NextResponse } from 'next/server';

/**
 * API root endpoint
 * GET /api/v1
 */
export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    data: {
      name: 'EduMart API',
      version: '0.1.0',
      endpoints: {
        auth: '/api/v1/auth',
        products: '/api/v1/products',
        cart: '/api/v1/cart',
        orders: '/api/v1/orders',
        vendor: '/api/v1/vendor',
        admin: '/api/v1/admin',
      },
    },
  });
}
