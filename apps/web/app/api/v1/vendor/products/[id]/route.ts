import { ProductStatus } from '@prisma/client'
import { NextRequest } from 'next/server'

import { hasPermission, toPermissionSubject } from '@/lib/authorization/policy'
import { errorResponse, successResponse } from '@/lib/response'
import { prisma } from '@/lib/prisma'
import { requireAuthenticatedAppUser } from '@/lib/supabase/request-auth'

export const runtime = 'nodejs'

async function getProduct(id: string) {
  return prisma.product.findFirst({
    where: { id, deletedAt: null },
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
  const auth = await requireAuthenticatedAppUser(request)
  if (!auth.user) {
    return errorResponse(auth.message, auth.status)
  }

  const subject = toPermissionSubject(auth.user)

  try {
    const { id } = await context.params
    const product = await getProduct(id)

    if (!product) {
      return errorResponse('Product not found', 404)
    }

    if (
      !hasPermission({
        subject,
        action: 'product.read',
        resource: {
          type: 'product',
          vendorId: product.vendorId,
          status: product.status,
        },
      })
    ) {
      return errorResponse('Product not found', 404)
    }

    return successResponse(product)
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : 'Unable to fetch product', 500)
  }
}

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const auth = await requireAuthenticatedAppUser(request)
  if (!auth.user) {
    return errorResponse(auth.message, auth.status)
  }

  const subject = toPermissionSubject(auth.user)

  try {
    const { id } = await context.params
    const existing = await getProduct(id)
    if (!existing) {
      return errorResponse('Product not found', 404)
    }

    if (
      !hasPermission({
        subject,
        action: 'product.update',
        resource: {
          type: 'product',
          vendorId: existing.vendorId,
          status: existing.status,
        },
      })
    ) {
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
  const auth = await requireAuthenticatedAppUser(request)
  if (!auth.user) {
    return errorResponse(auth.message, auth.status)
  }

  const subject = toPermissionSubject(auth.user)

  try {
    const { id } = await context.params
    const existing = await getProduct(id)
    if (!existing) {
      return errorResponse('Product not found', 404)
    }

    if (
      !hasPermission({
        subject,
        action: 'product.delete',
        resource: {
          type: 'product',
          vendorId: existing.vendorId,
          status: existing.status,
        },
      })
    ) {
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
