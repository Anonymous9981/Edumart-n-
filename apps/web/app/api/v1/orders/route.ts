import { randomUUID } from 'crypto'

import { UserRole } from '@edumart/shared'
import { NextRequest } from 'next/server'

import { prisma } from '../../../../lib/prisma'
import { errorResponse, successResponse } from '../../../../lib/response'

interface CreateOrderPayload {
  address: {
    fullName: string
    phone: string
    email: string
    line1: string
    city: string
    state: string
    pincode: string
  }
  paymentMethod: 'cod'
  totals: {
    subtotal: number
    discount: number
    shipping: number
    total: number
  }
  items: Array<{
    productId: string
    quantity: number
  }>
}

export async function POST(request: NextRequest) {
  let payload: CreateOrderPayload

  try {
    payload = (await request.json()) as CreateOrderPayload
  } catch {
    return errorResponse('Invalid request payload', 400, 'INVALID_PAYLOAD')
  }

  if (!payload?.address?.email || !payload?.address?.fullName || !payload?.address?.line1 || !payload?.address?.pincode) {
    return errorResponse('Address details are incomplete', 400, 'INVALID_ADDRESS')
  }

  if (!payload.items?.length) {
    return errorResponse('No items found for order', 400, 'EMPTY_ORDER')
  }

  const normalizedEmail = payload.address.email.trim().toLowerCase()

  try {
    const result = await prisma.$transaction(async (tx: any) => {
      const user =
        (await tx.user.findUnique({ where: { email: normalizedEmail } })) ??
        (await tx.user.create({
          data: {
            email: normalizedEmail,
            role: UserRole.CUSTOMER,
            firstName: payload.address.fullName.split(' ')[0] ?? payload.address.fullName,
            lastName: payload.address.fullName.split(' ').slice(1).join(' ') || null,
            phone: payload.address.phone,
            isEmailVerified: false,
            passwordHash: null,
          },
        }))

      const address = await tx.address.create({
        data: {
          userId: user.id,
          label: 'HOME',
          fullName: payload.address.fullName,
          phone: payload.address.phone,
          addressLine1: payload.address.line1,
          city: payload.address.city,
          state: payload.address.state,
          zipCode: payload.address.pincode,
          country: 'India',
        },
      })

      const orderNumber = `EDU-${Date.now().toString().slice(-8)}-${randomUUID().slice(0, 4).toUpperCase()}`

      const order = await tx.order.create({
        data: {
          userId: user.id,
          orderNumber,
          status: 'PENDING',
          paymentStatus: 'PENDING',
          paymentGateway: 'COD',
          totalAmount: payload.totals.subtotal,
          taxAmount: 0,
          shippingCost: payload.totals.shipping,
          discountAmount: payload.totals.discount,
          finalAmount: payload.totals.total,
          shippingAddressId: address.id,
          billingAddressId: address.id,
          notes: JSON.stringify({
            paymentMethod: payload.paymentMethod,
            source: 'web-checkout',
            cartItems: payload.items,
          }),
        },
      })

      const dbProducts = await tx.product.findMany({
        where: { id: { in: payload.items.map((item) => item.productId) } },
        select: { id: true, vendorId: true, finalPrice: true },
      })

      if (dbProducts.length) {
        const productMap = new Map<string, { id: string; vendorId: string; finalPrice: number }>(
          dbProducts.map((entry: { id: string; vendorId: string; finalPrice: number }) => [entry.id, entry]),
        )

        const orderItems: Array<{
          orderId: string
          productId: string
          vendorId: string
          quantity: number
          unitPrice: number
          discount: number
          total: number
          fulfillmentStatus: 'PENDING'
        }> = []

        payload.items.forEach((item) => {
          const product = productMap.get(item.productId)
          if (!product) {
            return
          }

          orderItems.push({
            orderId: order.id,
            productId: product.id,
            vendorId: product.vendorId,
            quantity: item.quantity,
            unitPrice: product.finalPrice,
            discount: 0,
            total: product.finalPrice * item.quantity,
            fulfillmentStatus: 'PENDING',
          })
        })

        if (orderItems.length) {
          await tx.orderItem.createMany({ data: orderItems })
        }
      }

      return { order, address }
    })

    return successResponse({
      orderId: result.order.id,
      orderNumber: result.order.orderNumber,
      total: result.order.finalAmount,
      paymentStatus: result.order.paymentStatus,
      status: result.order.status,
      address: {
        fullName: result.address.fullName,
        line1: result.address.addressLine1,
        city: result.address.city,
        state: result.address.state,
        pincode: result.address.zipCode,
      },
    })
  } catch {
    return errorResponse('Unable to create order right now', 500, 'ORDER_CREATE_FAILED')
  }
}
