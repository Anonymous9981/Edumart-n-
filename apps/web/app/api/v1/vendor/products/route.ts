import { UserRole } from '@edumart/shared'
import { NextRequest } from 'next/server'

import { errorResponse, successResponse } from '@/lib/response'
import { prisma } from '@/lib/prisma'
import { requireAuthenticatedAppUser } from '@/lib/supabase/request-auth'

function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const auth = await requireAuthenticatedAppUser(request, [UserRole.VENDOR, UserRole.ADMIN])
  if (!auth.user) {
    return errorResponse(auth.message, auth.status)
  }

  try {
    const { searchParams } = request.nextUrl
    const status = searchParams.get('status')

    const where: any = {
      deletedAt: null,
    }

    if (auth.user.role === UserRole.VENDOR) {
      where.vendorId = auth.user.vendorProfileId
    }

    if (status) {
      where.status = status.toUpperCase()
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
        images: {
          orderBy: [{ displayOrder: 'asc' }, { createdAt: 'asc' }],
        },
      },
      orderBy: [{ createdAt: 'desc' }],
    })

    return successResponse(products)
  } catch (error) {
    return errorResponse(
      error instanceof Error ? error.message : 'Unable to fetch vendor products',
      500,
      'VENDOR_PRODUCTS_FETCH_FAILED',
    )
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAuthenticatedAppUser(request, [UserRole.VENDOR, UserRole.ADMIN])
  if (!auth.user) {
    return errorResponse(auth.message, auth.status)
  }

  if (auth.user.role === UserRole.VENDOR && !auth.user.vendorProfileId) {
    return errorResponse('Vendor profile not found', 400)
  }

  try {
    const body = await request.json()
    const name = String(body?.name ?? '').trim()
    const categoryId = String(body?.categoryId ?? '').trim()
    const sku = String(body?.sku ?? '').trim()
    const basePrice = Number(body?.basePrice ?? 0)
    const discountPercentage = Math.max(0, Number(body?.discountPercentage ?? 0))
    const stock = Number.parseInt(String(body?.stock ?? 0), 10)
    const shortDescription = String(body?.shortDescription ?? '').trim() || null
    const description = String(body?.description ?? '').trim() || null
    const imageUrls = Array.isArray(body?.imageUrls)
      ? body.imageUrls.filter((url: unknown) => typeof url === 'string')
      : []

    if (!name || !categoryId || !sku || !Number.isFinite(basePrice) || !Number.isFinite(stock)) {
      return errorResponse('Missing required fields: name, categoryId, sku, basePrice, stock', 400)
    }

    const slug = toSlug(String(body?.slug ?? name))
    const finalPrice = Number((basePrice * (1 - Math.min(discountPercentage, 100) / 100)).toFixed(2))

    const vendorId =
      auth.user.role === UserRole.ADMIN
        ? String(body?.vendorId ?? '').trim()
        : (auth.user.vendorProfileId as string)

    if (!vendorId) {
      return errorResponse('vendorId is required for admin product creation', 400)
    }

    const product = await prisma.product.create({
      data: {
        vendorId,
        categoryId,
        name,
        slug,
        description,
        shortDescription,
        basePrice,
        discountPercentage,
        finalPrice,
        sku,
        stock,
        status: 'ACTIVE',
        tags: Array.isArray(body?.tags) ? body.tags.map(String) : [],
        images: imageUrls.length
          ? {
              create: imageUrls.map((imageUrl: string, index: number) => ({
                imageUrl,
                altText: `${name} image ${index + 1}`,
                displayOrder: index + 1,
              })),
            }
          : undefined,
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

    return successResponse(product, { status: 201 })
  } catch (error) {
    return errorResponse(
      error instanceof Error ? error.message : 'Unable to create product',
      500,
      'VENDOR_PRODUCT_CREATE_FAILED',
    )
  }
}
