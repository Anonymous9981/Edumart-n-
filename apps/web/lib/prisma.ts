type PrismaClientType = any

type PrismaClientConstructor = new (...args: unknown[]) => PrismaClientType

function createFallbackPrismaClient() {
  const handler: ProxyHandler<Record<string, unknown>> = {
    get(target, property) {
      if (property === 'then') {
        return undefined
      }

      if (!(property in target)) {
        target[property as keyof typeof target] = (..._args: unknown[]) => {
          return Promise.reject(new Error('Prisma client is not available in this environment'))
        }
      }

      return target[property as keyof typeof target]
    },
  }

  return new Proxy<Record<string, unknown>>({}, handler) as unknown as PrismaClientType
}

let PrismaClient: PrismaClientConstructor | undefined

try {
  PrismaClient = require('@prisma/client').PrismaClient as PrismaClientConstructor
} catch {
  PrismaClient = undefined
}

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClientType
}

export const prisma: PrismaClientType =
  globalForPrisma.prisma ??
  (PrismaClient
    ? new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
      })
    : createFallbackPrismaClient())

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
