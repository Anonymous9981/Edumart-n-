import { prisma } from '../lib/prisma'
import { buildTaxonomyFallbackProducts } from '../lib/catalog-mock'
import type { HomepageAudience, HomepageData, HomepageProduct } from '../lib/homepage-types'

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80'

const LEGACY_FALLBACK_PRODUCTS: HomepageProduct[] = [
  {
    id: 'fallback-student-1',
    slug: 'class-10-student-success-pack',
    title: 'Class 10 Student Success Pack',
    vendor: 'EduMart School Store',
    category: 'Student Essentials',
    audience: 'student',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=80',
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
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=900&q=80',
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
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=900&q=80',
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
    id: 'fallback-student-4',
    slug: 'science-lab-notebook-bundle',
    title: 'Science Lab Notebook Bundle',
    vendor: 'EduMart School Store',
    category: 'Science',
    audience: 'student',
    image: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=900&q=80',
    rating: 4.5,
    reviews: 141,
    price: 1099,
    finalPrice: 939,
    discountPercentage: 15,
    discountType: 'PERCENTAGE',
    discountValue: 15,
    schoolClasses: ['6', '7', '8', '9'],
    description: 'Science notebooks, activity sheets and observation logs for practical learning.',
    featured: true,
  },
  {
    id: 'fallback-student-5',
    slug: 'english-reading-grammar-pack',
    title: 'English Reading & Grammar Pack',
    vendor: 'EduMart School Store',
    category: 'Reading',
    audience: 'student',
    image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=900&q=80',
    rating: 4.8,
    reviews: 204,
    price: 1299,
    finalPrice: 1049,
    discountPercentage: 19,
    discountType: 'FIXED',
    discountValue: 250,
    schoolClasses: ['4', '5', '6', '7'],
    description: 'Reading, comprehension and grammar tools that support classroom and home study.',
    featured: true,
  },
  {
    id: 'fallback-student-6',
    slug: 'art-craft-essentials-box',
    title: 'Art & Craft Essentials Box',
    vendor: 'EduMart School Store',
    category: 'Art & Craft',
    audience: 'student',
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=900&q=80',
    rating: 4.6,
    reviews: 172,
    price: 799,
    finalPrice: 679,
    discountPercentage: 15,
    discountType: 'PERCENTAGE',
    discountValue: 15,
    schoolClasses: ['1', '2', '3', '4'],
    description: 'A colorful craft kit for drawing, coloring, and hands-on creative activities.',
    featured: true,
  },
  {
    id: 'fallback-student-7',
    slug: 'exam-revision-flashcards',
    title: 'Exam Revision Flashcards',
    vendor: 'EduMart School Store',
    category: 'Exam Prep',
    audience: 'student',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=900&q=80',
    rating: 4.9,
    reviews: 98,
    price: 699,
    finalPrice: 589,
    discountPercentage: 16,
    discountType: 'FIXED',
    discountValue: 110,
    schoolClasses: ['8', '9', '10', '11', '12'],
    description: 'Compact revision cards for last-minute exam review, formulas, and quick recall.',
    featured: true,
  },
  {
    id: 'fallback-student-8',
    slug: 'geometry-instruments-kit',
    title: 'Geometry Instruments Kit',
    vendor: 'EduMart School Store',
    category: 'Stationery',
    audience: 'student',
    image: 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=900&q=80',
    rating: 4.5,
    reviews: 213,
    price: 499,
    finalPrice: 419,
    discountPercentage: 16,
    discountType: 'PERCENTAGE',
    discountValue: 16,
    schoolClasses: ['5', '6', '7', '8'],
    description: 'A precision geometry kit with rulers, compass, protractor, and divider tools.',
    featured: true,
  },
  {
    id: 'fallback-student-9',
    slug: 'student-daypack-hydration-bag',
    title: 'Student Daypack & Hydration Bag',
    vendor: 'EduMart School Store',
    category: 'Bags',
    audience: 'student',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
    rating: 4.7,
    reviews: 167,
    price: 1799,
    finalPrice: 1499,
    discountPercentage: 17,
    discountType: 'FIXED',
    discountValue: 300,
    schoolClasses: ['3', '4', '5', '6', '7', '8'],
    description: 'A durable everyday school bag with bottle holder, compartments, and ergonomic support.',
    featured: true,
  },
  {
    id: 'fallback-student-10',
    slug: 'sports-day-activity-kit',
    title: 'Sports Day Activity Kit',
    vendor: 'EduMart School Store',
    category: 'Sports',
    audience: 'student',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=900&q=80',
    rating: 4.6,
    reviews: 121,
    price: 999,
    finalPrice: 829,
    discountPercentage: 17,
    discountType: 'PERCENTAGE',
    discountValue: 17,
    schoolClasses: ['1', '2', '3', '4', '5', '6'],
    description: 'A playful kit for sports day, PE exercises, and active classroom breaks.',
    featured: true,
  },
  {
    id: 'fallback-teacher-1',
    slug: 'wellness-360-assessment-partnership',
    title: 'Wellness 360 Assessment Partnership',
    vendor: 'EduMart School Solutions',
    category: 'Assessment Tools',
    audience: 'teacher',
    image: 'https://images.unsplash.com/photo-1516302752625-fcc3c50ae61f?auto=format&fit=crop&w=900&q=80',
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
    image: 'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=900&q=80',
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
    image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=900&q=80',
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
  {
    id: 'fallback-teacher-4',
    slug: 'smart-attendance-tablet-bundle',
    title: 'Smart Attendance Tablet Bundle',
    vendor: 'EduMart School Solutions',
    category: 'Attendance Tools',
    audience: 'teacher',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80',
    rating: 4.6,
    reviews: 119,
    price: 34999,
    finalPrice: 30999,
    discountPercentage: 11,
    discountType: 'FIXED',
    discountValue: 4000,
    description: 'A bundled attendance workflow for quick roll calls, reports, and parent updates.',
    featured: true,
  },
  {
    id: 'fallback-teacher-5',
    slug: 'library-starter-shelf-pack',
    title: 'Library Starter Shelf Pack',
    vendor: 'EduMart School Solutions',
    category: 'Library & Reading',
    audience: 'teacher',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=80',
    rating: 4.8,
    reviews: 87,
    price: 57999,
    finalPrice: 51999,
    discountPercentage: 10,
    discountType: 'PERCENTAGE',
    discountValue: 10,
    description: 'Starter shelves, reading labels, and catalog support for school libraries.',
    featured: true,
  },
  {
    id: 'fallback-teacher-6',
    slug: 'science-lab-safety-kit',
    title: 'Science Lab Safety Kit',
    vendor: 'EduMart School Solutions',
    category: 'Lab Equipment',
    audience: 'teacher',
    image: 'https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?auto=format&fit=crop&w=900&q=80',
    rating: 4.7,
    reviews: 96,
    price: 24999,
    finalPrice: 21999,
    discountPercentage: 12,
    discountType: 'FIXED',
    discountValue: 3000,
    description: 'Safety equipment and handling tools for structured classroom lab sessions.',
    featured: true,
  },
  {
    id: 'fallback-teacher-7',
    slug: 'classroom-furniture-set',
    title: 'Classroom Furniture Set',
    vendor: 'EduMart School Solutions',
    category: 'School Infrastructure',
    audience: 'teacher',
    image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80',
    rating: 4.9,
    reviews: 74,
    price: 149999,
    finalPrice: 139999,
    discountPercentage: 7,
    discountType: 'FIXED',
    discountValue: 10000,
    description: 'Furniture bundle for classrooms, staff rooms and shared learning spaces.',
    featured: true,
  },
  {
    id: 'fallback-teacher-8',
    slug: 'school-uniform-house-kit',
    title: 'School Uniform & House Kit',
    vendor: 'EduMart School Solutions',
    category: 'Uniforms',
    audience: 'teacher',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80',
    rating: 4.5,
    reviews: 101,
    price: 19999,
    finalPrice: 17499,
    discountPercentage: 13,
    discountType: 'PERCENTAGE',
    discountValue: 13,
    description: 'House wise and uniform stock bundles for school-level distribution.',
    featured: true,
  },
  {
    id: 'fallback-teacher-9',
    slug: 'sports-pe-equipment-rack',
    title: 'Sports & PE Equipment Rack',
    vendor: 'EduMart School Solutions',
    category: 'Sports & PE',
    audience: 'teacher',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=900&q=80',
    rating: 4.6,
    reviews: 68,
    price: 39999,
    finalPrice: 35999,
    discountPercentage: 10,
    discountType: 'FIXED',
    discountValue: 4000,
    description: 'PE and sports equipment organized for yearly school activity planning.',
    featured: true,
  },
  {
    id: 'fallback-teacher-10',
    slug: 'parent-communication-portal-setup',
    title: 'Parent Communication Portal Setup',
    vendor: 'EduMart School Solutions',
    category: 'School Software',
    audience: 'teacher',
    image: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=900&q=80',
    rating: 4.8,
    reviews: 112,
    price: 29999,
    finalPrice: 26999,
    discountPercentage: 10,
    discountType: 'PERCENTAGE',
    discountValue: 10,
    description: 'A communication layer for notices, reminders and school-parent coordination.',
    featured: true,
  },
]

const taxonomyFallbackProducts = buildTaxonomyFallbackProducts()

export const FALLBACK_PRODUCTS: HomepageProduct[] = [
  ...LEGACY_FALLBACK_PRODUCTS,
  ...taxonomyFallbackProducts.filter(
    (candidate) => !LEGACY_FALLBACK_PRODUCTS.some((existing) => existing.slug === candidate.slug),
  ),
]

function toHomepageProduct(product: {
  id: string
  slug: string
  name: string
  vendor: { storeName: string }
  category: { name: string; parent: { name: string } | null }
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
    category: product.category.parent?.name ?? product.category.name,
    subcategory: product.category.parent ? product.category.name : undefined,
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

    const dbProducts = products.map(toHomepageProduct)
    const mergedProducts = [
      ...dbProducts,
      ...taxonomyFallbackProducts.filter(
        (fallbackProduct) => !dbProducts.some((dbProduct) => dbProduct.slug === fallbackProduct.slug),
      ),
    ]

    return {
      products: mergedProducts,
    }
  } catch {
    return { products: FALLBACK_PRODUCTS }
  }
}
