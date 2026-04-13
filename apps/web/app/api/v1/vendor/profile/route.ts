import { UserRole } from '@edumart/shared'
import { NextRequest } from 'next/server'

import { errorResponse, successResponse } from '@/lib/response'
import { prisma } from '@/lib/prisma'
import { requireAuthenticatedAppUser } from '@/lib/supabase/request-auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const auth = await requireAuthenticatedAppUser(request, [UserRole.VENDOR, UserRole.ADMIN])
  if (!auth.user) {
    return errorResponse(auth.message, auth.status)
  }

  const user = await prisma.user.findUnique({
    where: { id: auth.user.id },
    include: {
      vendorProfile: true,
    },
  })

  if (!user || !user.vendorProfile) {
    return errorResponse('Vendor profile not found', 404)
  }

  return successResponse(user)
}

export async function PUT(request: NextRequest) {
  const auth = await requireAuthenticatedAppUser(request, [UserRole.VENDOR, UserRole.ADMIN])
  if (!auth.user) {
    return errorResponse(auth.message, auth.status)
  }

  if (!auth.user.vendorProfileId) {
    return errorResponse('Vendor profile not found', 404)
  }

  try {
    const body = await request.json()

    const updated = await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: auth.user!.id },
        data: {
          firstName: body?.firstName !== undefined ? String(body.firstName).trim() || null : undefined,
          lastName: body?.lastName !== undefined ? String(body.lastName).trim() || null : undefined,
          phone: body?.phone !== undefined ? String(body.phone).trim() || null : undefined,
          avatar: body?.avatar !== undefined ? String(body.avatar).trim() || null : undefined,
        },
      })

      return tx.vendorProfile.update({
        where: { id: auth.user!.vendorProfileId as string },
        data: {
          storeName: body?.storeName !== undefined ? String(body.storeName).trim() : undefined,
          description: body?.description !== undefined ? String(body.description).trim() || null : undefined,
          logo: body?.logo !== undefined ? String(body.logo).trim() || null : undefined,
          banner: body?.banner !== undefined ? String(body.banner).trim() || null : undefined,
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              phone: true,
              avatar: true,
              email: true,
            },
          },
        },
      })
    })

    return successResponse(updated)
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : 'Unable to update profile', 500)
  }
}
