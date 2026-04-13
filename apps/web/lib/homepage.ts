import { prisma } from '../lib/prisma'
import type { HomepageAudience, HomepageData, HomepageProduct } from './homepage-types'

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80'

export const FALLBACK_PRODUCTS: HomepageProduct[] = [];

function toHomepageProduct(product: {
  id: string
  slug: string
  name: string
  vendor: { storeName: string }
  category: { name: string }
  tags: string[] | null
  images: { imageUrl: string }[]
  rating: number | null
  reviewCount: number
  basePrice: number
  finalPrice: number
  discountPercentage: number
  shortDescription: string | null
  description: string | null
}): HomepageProduct {
  const tags = product.tags ?? []
  const audience: HomepageAudience = tags.includes('audience:teacher') ? 'teacher' : 'student'
  const featured = tags.includes('featured:homepage')
  const discountTypeTag = tags.find((tag) => tag.startsWith('discount:type:'))
  const discountValueTag = tags.find((tag) => tag.startsWith('discount:value:'))
  const schoolClassesTag = tags.find((tag) => tag.startsWith('school:classes:'))

  const discountType =
    discountTypeTag?.split(':')[2] === 'fixed'
      ? 'FIXED'
      : discountTypeTag?.split(':')[2] === 'percentage'
        ? 'PERCENTAGE'
        : undefined

  const discountValue = discountValueTag ? Number(discountValueTag.split(':')[2]) : undefined
  const schoolClasses = schoolClassesTag
    ? schoolClassesTag
        .split(':')[2]
        .split(',')
        .map((entry) => entry.trim())
        .filter(Boolean)
    : undefined

  return {
    id: product.id,
    slug: product.slug,
    title: product.name,
    vendor: product.vendor.storeName,
    category: product.category.name,
    audience,
    image: product.images[0]?.imageUrl ?? FALLBACK_IMAGE,
    rating: product.rating ?? 0,
    reviews: product.reviewCount,
    price: product.basePrice,
    finalPrice: product.finalPrice,
    discountPercentage: product.discountPercentage,
    discountType,
    discountValue,
    schoolClasses,
    description: product.shortDescription ?? product.description ?? product.name,
    featured,
    sceneVideoUrl:
      product.slug === 'plantorium-event-for-school-kids'
        ? 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'
        : undefined,
  }
}

export async function getHomepageData(): Promise<HomepageData> {
  try {
    const products = await prisma.product.findMany({
      where: {
        status: 'ACTIVE',
        deletedAt: null,
      },
      include: {
        vendor: {
          select: {
            storeName: true,
          },
        },
        category: {
          select: {
            name: true,
            parent: {
              select: {
                name: true,
              },
            },
          },
        },
        images: {
          orderBy: {
            displayOrder: 'asc',
          },
          take: 1,
          select: {
            imageUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 24,
    })
    return {
      products: products.map(toHomepageProduct),
    }
  } catch {
    return { products: [] }
  }
}
