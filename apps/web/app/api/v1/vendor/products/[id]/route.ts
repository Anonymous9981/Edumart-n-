import { UserRole } from '@edumart/shared'
import { ProductStatus } from '@prisma/client'
import { NextRequest } from 'next/server'

import { errorResponse, successResponse } from '@/lib/response'
import { prisma } from '@/lib/prisma'
import { requireAuthenticatedAppUser } from '@/lib/supabase/request-auth'

export const runtime = 'nodejs'

async function getOwnedProduct(id: string, user: { role: UserRole; vendorProfileId: string | null }) {
  const where: any = { id, deletedAt: null }

  if (user.role === UserRole.VENDOR) {
    where.vendorId = user.vendorProfileId
  }

  return prisma.product.findFirst({
    where,
    include: {
      category: {
        select: { id: true, name: true, slug: true },
      },
      images: {
        orderBy: [{ displayOrder: 'asc' }, { createdAt: 'asc' }],
      },
    },
  })
}

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const auth = await requireAuthenticatedAppUser(request, [UserRole.VENDOR, UserRole.ADMIN])
  if (!auth.user) {
    return errorResponse(auth.message, auth.status)
  }

  try {
    const { id } = await context.params
    const product = await getOwnedProduct(id, auth.user)

    if (!product) {
      return errorResponse('Product not found', 404)
    }

    return successResponse(product)
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : 'Unable to fetch product', 500)
  }
}

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const auth = await requireAuthenticatedAppUser(request, [UserRole.VENDOR, UserRole.ADMIN])
  if (!auth.user) {
    return errorResponse(auth.message, auth.status)
  }

  try {
    const { id } = await context.params
    const existing = await getOwnedProduct(id, auth.user)
    if (!existing) {
      return errorResponse('Product not found', 404)
    }

    const body = await request.json()
    const statusCandidate = body?.status !== undefined ? String(body.status).toUpperCase() : undefined
    const status =
      statusCandidate && statusCandidate in ProductStatus
        ? (statusCandidate as ProductStatus)
        : undefined

    const basePrice = body?.basePrice !== undefined ? Number(body.basePrice) : existing.basePrice
    const discountPercentage =
      body?.discountPercentage !== undefined ? Number(body.discountPercentage) : existing.discountPercentage
    const finalPrice = Number(
      (basePrice * (1 - Math.min(Math.max(discountPercentage, 0), 100) / 100)).toFixed(2),
    )

    const updated = await prisma.product.update({
      where: { id },
      data: {
        name: body?.name !== undefined ? String(body.name).trim() : undefined,
        description:
          body?.description !== undefined ? String(body.description).trim() || null : undefined,
        shortDescription:
          body?.shortDescription !== undefined
            ? String(body.shortDescription).trim() || null
            : undefined,
        basePrice,
        discountPercentage,
        finalPrice,
        sku: body?.sku !== undefined ? String(body.sku).trim() : undefined,
        stock: body?.stock !== undefined ? Number.parseInt(String(body.stock), 10) : undefined,
        status,
        tags: Array.isArray(body?.tags) ? body.tags.map(String) : undefined,
      },
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
        images: {
          orderBy: [{ displayOrder: 'asc' }, { createdAt: 'asc' }],
        },
      },
    })

    return successResponse(updated)
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : 'Unable to update product', 500)
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const auth = await requireAuthenticatedAppUser(request, [UserRole.VENDOR, UserRole.ADMIN])
  if (!auth.user) {
    return errorResponse(auth.message, auth.status)
  }

  try {
    const { id } = await context.params
    const existing = await getOwnedProduct(id, auth.user)
    if (!existing) {
      return errorResponse('Product not found', 404)
    }

    await prisma.product.update({
      where: { id },
      data: {
        status: 'DELETED',
        deletedAt: new Date(),
      },
    })

    return successResponse({ deleted: true })
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : 'Unable to delete product', 500)
  }
}
