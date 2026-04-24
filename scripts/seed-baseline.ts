/// <reference types="node" />

import bcrypt from 'bcryptjs'
import { PrismaClient, UserRole, AccountStatus } from '@prisma/client'

const prisma = new PrismaClient()

function requireEnv(name: string) {
  const value = process.env[name]?.trim()
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

function assertStrongSecret(name: string) {
  const value = requireEnv(name)
  const weakValues = new Set([
    'replace-with-strong-secret',
    'your-super-secret-jwt-key-min-32-chars',
    'your-refresh-token-secret-min-32-chars',
  ])

  if (value.length < 32 || weakValues.has(value)) {
    throw new Error(`${name} must be at least 32 chars and not a placeholder`)
  }
}

async function ensureAdminUser() {
  const email = requireEnv('SEED_ADMIN_EMAIL').toLowerCase()
  const password = requireEnv('SEED_ADMIN_PASSWORD')
  const firstName = process.env.SEED_ADMIN_FIRST_NAME?.trim() || 'Admin'
  const lastName = process.env.SEED_ADMIN_LAST_NAME?.trim() || 'User'

  if (password.length < 12) {
    throw new Error('SEED_ADMIN_PASSWORD must be at least 12 characters')
  }

  const passwordHash = await bcrypt.hash(password, 12)

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    await prisma.user.update({
      where: { id: existing.id },
      data: {
        role: UserRole.ADMIN,
        accountStatus: AccountStatus.ACTIVE,
        isActive: true,
        isEmailVerified: true,
        passwordHash,
        firstName,
        lastName,
      },
    })
    return
  }

  await prisma.user.create({
    data: {
      email,
      passwordHash,
      role: UserRole.ADMIN,
      accountStatus: AccountStatus.ACTIVE,
      isActive: true,
      isEmailVerified: true,
      firstName,
      lastName,
    },
  })
}

async function ensureBaselineCatalog() {
  const categories = [
    { name: 'Student Essentials', slug: 'student-essentials', description: 'Products and kits for students and learners' },
    { name: 'Workbooks', slug: 'workbooks', description: 'Practice books and learning packs' },
    { name: 'Coding Kits', slug: 'coding-kits', description: 'Hands-on coding kits for students' },
    { name: 'Assessment Tools', slug: 'assessment-tools', description: 'Wellness and assessment products for schools' },
    { name: 'Classroom Tech', slug: 'classroom-tech', description: 'Teaching panels and smart classroom hardware' },
    { name: 'School Events', slug: 'school-events', description: 'Event products and activity kits for schools' },
  ]

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      create: {
        ...category,
        isActive: true,
      },
      update: {
        name: category.name,
        description: category.description,
        isActive: true,
      },
    })
  }

  await prisma.coupon.upsert({
    where: { code: 'WELCOME20' },
    create: {
      code: 'WELCOME20',
      type: 'PERCENTAGE',
      value: 20,
      minOrderValue: 50,
      usageLimit: 5000,
      timesUsed: 0,
      validFrom: new Date(),
      validTo: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
      isActive: true,
    },
    update: {
      isActive: true,
      validTo: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
    },
  })

  await prisma.banner.upsert({
    where: { title: 'Welcome to EduMart' },
    create: {
      title: 'Welcome to EduMart',
      content: 'Shop trusted educational products and services.',
      imageUrl: 'https://via.placeholder.com/1200x300?text=Welcome+to+EduMart',
      link: '/',
      displayOrder: 1,
      isActive: true,
      validFrom: new Date(),
      validTo: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    },
    update: {
      isActive: true,
      displayOrder: 1,
      validTo: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    },
  })
}

async function main() {
  assertStrongSecret('JWT_SECRET')
  assertStrongSecret('JWT_REFRESH_SECRET')
  requireEnv('DATABASE_URL')
  requireEnv('NEXT_PUBLIC_SUPABASE_URL')
  requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY')

  await ensureAdminUser()
  await ensureBaselineCatalog()

  console.log('✅ Baseline production seed complete')
}

main()
  .catch((error) => {
    console.error('❌ Baseline production seed failed:', error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
