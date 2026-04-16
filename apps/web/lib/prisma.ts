import { PrismaClient } from '@prisma/client'

type PrismaClientType = PrismaClient

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClientType
}

function resolveSupabaseDatabaseUrl() {
  const password = process.env.SUPABASE_DB_PASSWORD?.trim()
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()

  if (!supabaseUrl || !password) {
    return null
  }

  const projectRef = supabaseUrl.match(/^https:\/\/([^.]+)\./)?.[1]
  if (!projectRef) {
    return null
  }

  const projectRegion = process.env.SUPABASE_REGION?.trim() || 'ap-northeast-2'
  const host = process.env.SUPABASE_POOLER_HOST?.trim() || `${projectRef}.pooler.supabase.com`
  const port = process.env.SUPABASE_POOLER_PORT?.trim() || '6543'
  const user = process.env.SUPABASE_DB_USER?.trim() || `postgres.${projectRef}`
  const database = process.env.SUPABASE_DB_NAME?.trim() || 'postgres'

  return `postgresql://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}/${database}?sslmode=require`
}

function resolveDatabaseUrl() {
  const current = process.env.DATABASE_URL?.trim() || ''
  const directCurrent = process.env.DIRECT_URL?.trim() || ''
  const usesLocalhost = current.includes('localhost:5432') || directCurrent.includes('localhost:5432')

  if (!current || usesLocalhost) {
    const supabaseUrl = resolveSupabaseDatabaseUrl()
    if (supabaseUrl) {
      process.env.DATABASE_URL = supabaseUrl
      process.env.DIRECT_URL = supabaseUrl
    }
  }
}

resolveDatabaseUrl()

export const prisma: PrismaClientType =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
