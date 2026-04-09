import { PrismaClient } from '@prisma/client'

type PrismaClientType = PrismaClient

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClientType
}

export const prisma: PrismaClientType =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
