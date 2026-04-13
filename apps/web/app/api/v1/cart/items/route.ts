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

export async function POST(request: NextRequest) {
  const auth = await requireAuthenticatedAppUser(request)
  if (!auth.user) {
    return errorResponse(auth.message, auth.status)
  }

  try {
    const body = await request.json()
    const productId = String(body?.productId ?? '').trim()
    const quantity = Math.max(1, Number.parseInt(String(body?.quantity ?? 1), 10))

    if (!productId) {
      return errorResponse('productId is required', 400)
    }

    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        status: 'ACTIVE',
        deletedAt: null,
      },
      select: {
        id: true,
        finalPrice: true,
      },
    })

    if (!product) {
      return errorResponse('Product not found', 404)
    }

    const cart = await getOrCreateUserCart(auth.user.id)
    const item = await prisma.cartItem.upsert({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
      update: {
        quantity: {
          increment: quantity,
        },
      },
      create: {
        cartId: cart.id,
        productId,
        quantity,
        addedPrice: product.finalPrice,
        userId: auth.user.id,
      },
    })

    return successResponse(item, { status: 201 })
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : 'Unable to add item to cart', 500)
  }
}

export async function PUT(request: NextRequest) {
  const auth = await requireAuthenticatedAppUser(request)
  if (!auth.user) {
    return errorResponse(auth.message, auth.status)
  }

  try {
    const body = await request.json()
    const itemId = String(body?.itemId ?? '').trim()
    const quantity = Number.parseInt(String(body?.quantity ?? 1), 10)

    if (!itemId || !Number.isFinite(quantity)) {
      return errorResponse('itemId and quantity are required', 400)
    }

    const cart = await getOrCreateUserCart(auth.user.id)
    const existing = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cartId: cart.id,
      },
    })

    if (!existing) {
      return errorResponse('Cart item not found', 404)
    }

    if (quantity <= 0) {
      await prisma.cartItem.delete({ where: { id: existing.id } })
      return successResponse({ deleted: true })
    }

    const updated = await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity },
    })

    return successResponse(updated)
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : 'Unable to update cart item', 500)
  }
}

export async function DELETE(request: NextRequest) {
  const auth = await requireAuthenticatedAppUser(request)
  if (!auth.user) {
    return errorResponse(auth.message, auth.status)
  }

  try {
    const body = await request.json().catch(() => ({}))
    const itemId = String(body?.itemId ?? '').trim()
    const productId = String(body?.productId ?? '').trim()
    const cart = await getOrCreateUserCart(auth.user.id)

    if (!itemId && !productId) {
      return errorResponse('itemId or productId is required', 400)
    }

    await prisma.cartItem.deleteMany({
      where: {
        cartId: cart.id,
        ...(itemId ? { id: itemId } : {}),
        ...(productId ? { productId } : {}),
      },
    })

    return successResponse({ deleted: true })
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : 'Unable to remove cart item', 500)
  }
}
