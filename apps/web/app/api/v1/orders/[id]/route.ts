import { NextRequest } from 'next/server'

import { prisma } from '../../../../../lib/prisma'
import { errorResponse, successResponse } from '../../../../../lib/response'

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        shippingAddress: true,
        items: true,
      },
    })

    if (!order) {
      return errorResponse('Order not found', 404, 'ORDER_NOT_FOUND')
    }

    return successResponse({
      id: order.id,
      orderNumber: order.orderNumber,
      paymentStatus: order.paymentStatus,
      status: order.status,
      itemCount: order.items.length,
      total: order.finalAmount,
      shippingAddress: order.shippingAddress
        ? {
            fullName: order.shippingAddress.fullName,
            line1: order.shippingAddress.addressLine1,
            city: order.shippingAddress.city,
            state: order.shippingAddress.state,
            pincode: order.shippingAddress.zipCode,
          }
        : null,
    })
  } catch {
    return errorResponse('Unable to load order', 500, 'ORDER_FETCH_FAILED')
  }
}
