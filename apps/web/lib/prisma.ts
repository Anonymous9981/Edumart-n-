import * as PrismaClientModule from '../../../node_modules/.pnpm/@prisma+client@5.22.0_prisma@5.22.0/node_modules/.prisma/client';

const PrismaClient = (PrismaClientModule as any).PrismaClient;

const globalForPrisma = globalThis as unknown as {
  prisma?: any;
};

export const prisma: any =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
