import { NextRequest } from 'next/server'

import { errorResponse, successResponse } from '@/lib/response'
import { prisma } from '@/lib/prisma'
import { requireAuthenticatedAppUser } from '@/lib/supabase/request-auth'

export const runtime = 'nodejs'

async function getOrCreateUserCart(userId: string) {
  const existing = await prisma.cart.findFirst({ where: { userId } })
  if (existing) {
    return existing
  }

  return prisma.cart.create({
    data: {
      userId,
    },
  })
}

export async function GET(request: NextRequest) {
  const auth = await requireAuthenticatedAppUser(request)
  if (!auth.user) {
    return errorResponse(auth.message, auth.status)
  }

  try {
    const cart = await getOrCreateUserCart(auth.user.id)
    const cartItems = await prisma.cartItem.findMany({
      where: { cartId: cart.id },
      include: {
        product: {
          include: {
            images: {
              orderBy: [{ displayOrder: 'asc' }, { createdAt: 'asc' }],
            },
            vendor: {
              select: {
                id: true,
                storeName: true,
              },
            },
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
      orderBy: [{ createdAt: 'desc' }],
    })

    return successResponse({
      cartId: cart.id,
      items: cartItems,
    })
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : 'Unable to fetch cart', 500)
  }
}

export async function DELETE(request: NextRequest) {
  const auth = await requireAuthenticatedAppUser(request)
  if (!auth.user) {
    return errorResponse(auth.message, auth.status)
  }

  try {
    const cart = await getOrCreateUserCart(auth.user.id)
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } })
    return successResponse({ cleared: true })
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : 'Unable to clear cart', 500)
  }
}
