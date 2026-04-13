import { errorResponse, successResponse } from '@/lib/response'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true, parentId: null },
      include: {
        children: {
          where: { isActive: true },
          include: {
            _count: {
              select: {
                products: {
                  where: {
                    status: 'ACTIVE',
                    deletedAt: null,
                  },
                },
              },
            },
          },
          orderBy: [{ displayOrder: 'asc' }, { name: 'asc' }],
        },
        _count: {
          select: {
            products: {
              where: {
                status: 'ACTIVE',
                deletedAt: null,
              },
            },
          },
        },
      },
      orderBy: [{ displayOrder: 'asc' }, { name: 'asc' }],
    })

    return successResponse(categories)
  } catch (error) {
    return errorResponse(
      error instanceof Error ? error.message : 'Unable to fetch categories',
      500,
      'CATEGORIES_FETCH_FAILED',
    )
  }
}
