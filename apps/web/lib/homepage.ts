import { prisma } from './prisma'
import type { HomepageAudience, HomepageData, HomepageProduct } from './homepage-types'

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80'

const FALLBACK_PRODUCTS: HomepageProduct[] = [
  {
    id: 'fallback-student-1',
    slug: 'class-10-student-success-pack',
    title: 'Class 10 Student Success Pack',
    vendor: 'EduMart School Store',
    category: 'Student Essentials',
    audience: 'student',
    image:
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=80',
    rating: 4.7,
    reviews: 234,
    price: 1499,
    finalPrice: 1199,
    discountPercentage: 20,
    discountType: 'PERCENTAGE',
    discountValue: 20,
    schoolClasses: ['9', '10'],
    description: 'A starter pack with notebooks, practice sheets, and study tools for class 10 students.',
    featured: true,
  },
  {
    id: 'fallback-student-2',
    slug: 'maths-practice-workbook-set',
    title: 'Maths Practice Workbook Set',
    vendor: 'EduMart School Store',
    category: 'Workbooks',
    audience: 'student',
    image:
      'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=900&q=80',
    rating: 4.8,
    reviews: 189,
    price: 899,
    finalPrice: 764,
    discountPercentage: 15,
    discountType: 'FIXED',
    discountValue: 135,
    schoolClasses: ['6', '7', '8'],
    description: 'A focused workbook pack for building speed, accuracy, and confidence in mathematics.',
    featured: true,
  },
  {
    id: 'fallback-student-3',
    slug: 'coding-for-teens-starter-kit',
    title: 'Coding for Teens Starter Kit',
    vendor: 'EduMart School Store',
    category: 'Coding Kits',
    audience: 'student',
    image:
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=900&q=80',
    rating: 4.6,
    reviews: 156,
    price: 1999,
    finalPrice: 1639,
    discountPercentage: 18,
    discountType: 'PERCENTAGE',
    discountValue: 18,
    schoolClasses: ['8', '9', '10', '11'],
    description: 'A beginner friendly coding kit for teens with guided learning and hands on activities.',
    featured: true,
  },
  {
    id: 'fallback-teacher-1',
    slug: 'wellness-360-assessment-partnership',
    title: 'Wellness 360 Assessment Partnership',
    vendor: 'EduMart School Solutions',
    category: 'Assessment Tools',
    audience: 'teacher',
    image:
      'https://images.unsplash.com/photo-1516302752625-fcc3c50ae61f?auto=format&fit=crop&w=900&q=80',
    rating: 4.9,
    reviews: 316,
    price: 49999,
    finalPrice: 43999,
    discountPercentage: 12,
    discountType: 'PERCENTAGE',
    discountValue: 12,
    description: 'A school partnership product for student wellness tracking, assessment and support planning.',
    featured: true,
  },
  {
    id: 'fallback-teacher-2',
    slug: 'interactive-flat-panel-for-teaching',
    title: 'Interactive Flat Panel for Teaching',
    vendor: 'EduMart School Solutions',
    category: 'Classroom Tech',
    audience: 'teacher',
    image:
      'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=900&q=80',
    rating: 4.8,
    reviews: 128,
    price: 129999,
    finalPrice: 119599,
    discountPercentage: 8,
    discountType: 'FIXED',
    discountValue: 10400,
    description: 'A smart classroom display built for teaching, hybrid lessons and interactive collaboration.',
    featured: true,
  },
  {
    id: 'fallback-teacher-3',
    slug: 'plantorium-event-for-school-kids',
    title: 'Plantorium Event for School Kids',
    vendor: 'EduMart School Solutions',
    category: 'School Events',
    audience: 'teacher',
    image:
      'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=900&q=80',
    rating: 4.7,
    reviews: 244,
    price: 14999,
    finalPrice: 12599,
    discountPercentage: 16,
    discountType: 'PERCENTAGE',
    discountValue: 16,
    description: 'An experiential event product for school kids focused on plants, science, and creative learning.',
    featured: true,
    sceneVideoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
  },
]

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
  if (!process.env.DATABASE_URL) {
    return { products: FALLBACK_PRODUCTS }
  }

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
    return { products: FALLBACK_PRODUCTS }
  }
}
