import { errorResponse, successResponse } from '@/lib/response'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const vendors = await prisma.vendorProfile.findMany({
      where: {
        deletedAt: null,
        verificationStatus: 'APPROVED',
      },
      select: {
        id: true,
        storeName: true,
        description: true,
        logo: true,
        banner: true,
        verificationStatus: true,
        rating: true,
        reviewCount: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
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
      orderBy: [{ rating: 'desc' }, { reviewCount: 'desc' }, { createdAt: 'desc' }],
    })

    return successResponse(vendors)
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : 'Unable to fetch vendors', 500)
  }
}
