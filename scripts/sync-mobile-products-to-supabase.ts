/// <reference types="node" />

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const mockProducts: Array<{
  id: string
  name: string
  subtitle: string
  image: string
  description: string
  category: string
  audience: 'student' | 'school'
  gradeBand: string
  price: number
  discountPercent: number
  rating: number
  reviewCount: number
  stock: number
  featured?: boolean
}> = [
  {
    id: 'bk-math-7',
    name: 'Class 7 Mathematics Set',
    subtitle: 'NCERT aligned with workbook',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=900&q=80',
    description: 'Complete class kit with textbook, workbook, and weekly practice sheets for guided revision.',
    category: 'Books',
    audience: 'student',
    gradeBand: 'Class 7',
    price: 899,
    discountPercent: 12,
    rating: 4.8,
    reviewCount: 412,
    stock: 34,
    featured: true,
  },
  {
    id: 'bk-sci-8',
    name: 'Class 8 Science Lab Notes',
    subtitle: 'Practical-ready diagrams',
    image: 'https://images.unsplash.com/photo-1532153975070-2e9ab71f1b14?auto=format&fit=crop&w=900&q=80',
    description: 'Concept summaries and lab-ready templates designed for school practical workflows.',
    category: 'Books',
    audience: 'student',
    gradeBand: 'Class 8',
    price: 649,
    discountPercent: 10,
    rating: 4.7,
    reviewCount: 259,
    stock: 21,
  },
  {
    id: 'st-prem-kit',
    name: 'Premium Stationery Combo',
    subtitle: 'Notebooks, pens, geometry tools',
    image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=900&q=80',
    description: 'Premium writing and geometry kit tailored for middle school and board exam preparation.',
    category: 'Stationery',
    audience: 'student',
    gradeBand: 'Class 6-10',
    price: 1199,
    discountPercent: 18,
    rating: 4.6,
    reviewCount: 198,
    stock: 50,
  },
  {
    id: 'tech-lamp',
    name: 'Smart Study Lamp',
    subtitle: 'Eye-care LED with timer',
    image: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=900&q=80',
    description: 'Adjustable brightness with low blue-light mode and auto timer for focused sessions.',
    category: 'Tech',
    audience: 'student',
    gradeBand: 'All grades',
    price: 1499,
    discountPercent: 20,
    rating: 4.9,
    reviewCount: 533,
    stock: 18,
    featured: true,
  },
  {
    id: 'fur-chair-ergo',
    name: 'Ergo Student Chair',
    subtitle: 'Posture support design',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
    description: 'Compact ergonomic chair for study corners and school reading spaces.',
    category: 'Furniture',
    audience: 'school',
    gradeBand: 'All grades',
    price: 3299,
    discountPercent: 16,
    rating: 4.5,
    reviewCount: 73,
    stock: 27,
  },
  {
    id: 'tech-headset',
    name: 'Online Class Headset',
    subtitle: 'Noise-reducing mic',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
    description: 'Clear audio headset with soft earcups and detachable mic for class calls.',
    category: 'Tech',
    audience: 'student',
    gradeBand: 'Class 4-12',
    price: 1899,
    discountPercent: 22,
    rating: 4.7,
    reviewCount: 241,
    stock: 30,
  },
]

function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function toSku(value: string) {
  return value
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '-')
    .slice(0, 30)
}

async function ensureSyncVendor() {
  const email = process.env.SYNC_VENDOR_EMAIL?.trim() || 'catalog-sync@edumart.com'
  const storeName = process.env.SYNC_VENDOR_STORE?.trim() || 'EduMart Live Catalog'

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      role: 'VENDOR',
      isActive: true,
      isEmailVerified: true,
    },
    create: {
      email,
      role: 'VENDOR',
      isActive: true,
      isEmailVerified: true,
      firstName: 'Catalog',
      lastName: 'Sync',
      passwordHash: null,
    },
  })

  const vendor = await prisma.vendorProfile.upsert({
    where: { userId: user.id },
    update: {
      storeName,
      verificationStatus: 'APPROVED',
      description: 'Auto-synced product catalog for live shop rendering',
    },
    create: {
      userId: user.id,
      storeName,
      verificationStatus: 'APPROVED',
      description: 'Auto-synced product catalog for live shop rendering',
      rating: 4.7,
      reviewCount: 0,
    },
  })

  return vendor
}

async function main() {
  console.log('Syncing mobile catalog products to Supabase/Postgres via Prisma...')

  const vendor = await ensureSyncVendor()

  for (const item of mockProducts) {
    const categorySlug = toSlug(item.category)

    const category = await prisma.category.upsert({
      where: { slug: categorySlug },
      update: {
        name: item.category,
        isActive: true,
      },
      create: {
        name: item.category,
        slug: categorySlug,
        isActive: true,
      },
    })

    const slug = toSlug(item.id || item.name)
    const basePrice = Number(item.price)
    const discountPercentage = Number(item.discountPercent)
    const finalPrice = Number((basePrice * (1 - Math.min(Math.max(discountPercentage, 0), 100) / 100)).toFixed(2))

    const product = await prisma.product.upsert({
      where: { slug },
      update: {
        vendorId: vendor.id,
        categoryId: category.id,
        name: item.name,
        shortDescription: item.subtitle,
        description: item.description,
        basePrice,
        discountPercentage,
        finalPrice,
        stock: Math.max(0, Number(item.stock)),
        lowStockThreshold: 10,
        status: 'ACTIVE',
        rating: item.rating,
        reviewCount: item.reviewCount,
        tags: [
          item.audience === 'school' ? 'audience:teacher' : 'audience:student',
          `grade:${toSlug(item.gradeBand)}`,
          ...(item.featured ? ['featured:homepage'] : []),
        ],
      },
      create: {
        vendorId: vendor.id,
        categoryId: category.id,
        name: item.name,
        slug,
        shortDescription: item.subtitle,
        description: item.description,
        sku: toSku(`SYNC-${item.id}`),
        basePrice,
        discountPercentage,
        finalPrice,
        stock: Math.max(0, Number(item.stock)),
        lowStockThreshold: 10,
        status: 'ACTIVE',
        rating: item.rating,
        reviewCount: item.reviewCount,
        tags: [
          item.audience === 'school' ? 'audience:teacher' : 'audience:student',
          `grade:${toSlug(item.gradeBand)}`,
          ...(item.featured ? ['featured:homepage'] : []),
        ],
      },
    })

    await prisma.productImage.deleteMany({ where: { productId: product.id } })
    await prisma.productImage.create({
      data: {
        productId: product.id,
        imageUrl: item.image,
        altText: item.name,
        displayOrder: 1,
      },
    })
  }

  console.log(`Synced ${mockProducts.length} products with image, name, and price.`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
