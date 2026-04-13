import { NextRequest } from 'next/server'

import { errorResponse, paginatedResponse } from '@/lib/response'
import { prisma } from '@/lib/prisma'

function toPositiveInt(value: string | null, fallback: number) {
  const parsed = Number.parseInt(value ?? '', 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const page = toPositiveInt(searchParams.get('page'), 1)
    const limit = Math.min(toPositiveInt(searchParams.get('limit'), 20), 100)
    const search = searchParams.get('search')?.trim()
    const category = searchParams.get('category')?.trim()
    const vendor = searchParams.get('vendor')?.trim()

    const where: any = {
      status: 'ACTIVE',
      deletedAt: null,
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { shortDescription: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (category) {
      where.category = {
        OR: [{ id: category }, { slug: category }],
      }
    }

    if (vendor) {
      where.vendor = {
        OR: [{ id: vendor }, { storeName: { contains: vendor, mode: 'insensitive' } }],
      }
    }

    const [total, products] = await prisma.$transaction([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        include: {
          category: {
            select: { id: true, name: true, slug: true },
          },
          vendor: {
            select: { id: true, storeName: true, verificationStatus: true },
          },
          images: {
            orderBy: [{ displayOrder: 'asc' }, { createdAt: 'asc' }],
            select: {
              id: true,
              imageUrl: true,
              altText: true,
              displayOrder: true,
            },
          },
        },
        orderBy: [{ createdAt: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
    ])

    return paginatedResponse(products, {
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(Math.ceil(total / limit), 1),
      },
    })
  } catch (error) {
    return errorResponse(
      error instanceof Error ? error.message : 'Unable to fetch products',
      500,
      'PRODUCTS_FETCH_FAILED',
    )
  }
}
