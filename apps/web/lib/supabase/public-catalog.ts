import { createClient } from '@supabase/supabase-js'

import type { HomepageProduct } from '../homepage-types'
import { getSupabasePublishableKey, getSupabaseServiceRoleKey, getSupabaseUrl } from './env'

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80'

type CatalogProductRow = {
  id: string
  slug: string
  name: string
  vendorId: string
  categoryId: string
  tags: string[] | null
  rating: number | null
  reviewCount: number
  basePrice: number
  finalPrice: number
  discountPercentage: number
  shortDescription: string | null
  description: string | null
  createdAt: string
  deletedAt: string | null
  status: string
}

type CatalogCategoryRow = {
  id: string
  name: string
  parentId: string | null
}

type CatalogVendorRow = {
  id: string
  storeName: string
}

type CatalogImageRow = {
  productId: string
  imageUrl: string
  displayOrder: number
}

type CatalogClient = ReturnType<typeof createClient>

let catalogClient: CatalogClient | null = null

function getCatalogClient() {
  const serviceRoleKey = getSupabaseServiceRoleKey()
  const key = serviceRoleKey || getSupabasePublishableKey()

  if (!catalogClient) {
    catalogClient = createClient(getSupabaseUrl(), key, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  }

  return catalogClient
}

async function fetchRows<T>(table: string, query: string) {
  const client = getCatalogClient()
  if (!client) {
    return [] as T[]
  }

  const response = await client.from(table).select(query)
  if (response.error || !response.data) {
    return [] as T[]
  }

  return response.data as T[]
}

async function fetchRowsFromCandidates<T>(tables: string[], query: string) {
  let best: T[] = []

  for (const table of tables) {
    const rows = await fetchRows<T>(table, query)
    if (rows.length > best.length) {
      best = rows
    }
  }

  return best
}

function toHomepageProduct(
  product: CatalogProductRow,
  vendorName: string,
  categoryName: string,
  parentCategoryName: string | null,
  imageUrl: string | null,
): HomepageProduct {
  const tags = product.tags ?? []
  const audience = tags.includes('audience:teacher') ? 'teacher' : 'student'
  const featured = tags.includes('featured:homepage')
  const schoolClassesTag = tags.find((tag) => tag.startsWith('school:classes:'))
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
    vendor: vendorName,
    category: parentCategoryName ?? categoryName,
    subcategory: parentCategoryName ? categoryName : undefined,
    audience,
    image: imageUrl ?? FALLBACK_IMAGE,
    rating: product.rating ?? 0,
    reviews: product.reviewCount,
    price: product.basePrice,
    finalPrice: product.finalPrice,
    discountPercentage: product.discountPercentage,
    discountType: product.discountPercentage > 0 ? 'PERCENTAGE' : undefined,
    discountValue: undefined,
    schoolClasses,
    description: product.shortDescription ?? product.description ?? product.name,
    featured,
    sceneVideoUrl:
      product.slug === 'plantorium-event-for-school-kids'
        ? 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'
        : undefined,
  }
}

export async function buildHomepageProducts(take: number): Promise<HomepageProduct[]> {
  const [products, categories, vendors, images] = await Promise.all([
    fetchRowsFromCandidates<CatalogProductRow>(
      ['Product', 'product'],
      'id,slug,name,vendorId,categoryId,tags,rating,reviewCount,basePrice,finalPrice,discountPercentage,shortDescription,description,createdAt,deletedAt,status',
    ),
    fetchRowsFromCandidates<CatalogCategoryRow>(['Category', 'category'], 'id,name,parentId'),
    fetchRowsFromCandidates<CatalogVendorRow>(['VendorProfile', 'vendorprofile'], 'id,storeName'),
    fetchRowsFromCandidates<CatalogImageRow>(['ProductImage', 'productimage'], 'productId,imageUrl,displayOrder'),
  ])

  if (!products.length) {
    return []
  }

  const categoryById = new Map(categories.map((category) => [category.id, category]))
  const vendorById = new Map(vendors.map((vendor) => [vendor.id, vendor]))
  const imagesByProductId = new Map<string, CatalogImageRow[]>()

  images
    .slice()
    .sort((left, right) => left.displayOrder - right.displayOrder)
    .forEach((image) => {
      const current = imagesByProductId.get(image.productId) ?? []
      current.push(image)
      imagesByProductId.set(image.productId, current)
    })

  return products
    .filter((product) => product.status === 'ACTIVE' && product.deletedAt === null)
    .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
    .slice(0, take)
    .map((product) => {
      const category = categoryById.get(product.categoryId)
      const parent = category?.parentId ? categoryById.get(category.parentId) : null
      const vendor = vendorById.get(product.vendorId)
      const imageUrl = imagesByProductId.get(product.id)?.[0]?.imageUrl ?? null

      return toHomepageProduct(
        product,
        vendor?.storeName ?? 'EduMart Vendor',
        category?.name ?? 'Products',
        parent?.name ?? null,
        imageUrl,
      )
    })
}

export type CatalogNavCategory = {
  id: string
  name: string
  slug: string
  description?: string | null
  image?: string | null
  subcategories: Array<{
    id: string
    name: string
    slug: string
    description?: string | null
    image?: string | null
  }>
}

export function buildCatalogCategories(products: HomepageProduct[]): CatalogNavCategory[] {
  const grouped = new Map<string, CatalogNavCategory>()

  products.forEach((product) => {
    const categorySlug = product.category.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const existing = grouped.get(product.category) ?? {
      id: `category-${categorySlug}`,
      name: product.category,
      slug: categorySlug,
      description: undefined,
      image: product.image,
      subcategories: [],
    }

    if (product.subcategory) {
      const subcategorySlug = product.subcategory.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      const alreadyExists = existing.subcategories.some((item) => item.name === product.subcategory)

      if (!alreadyExists) {
        existing.subcategories.push({
          id: `subcategory-${subcategorySlug}`,
          name: product.subcategory,
          slug: subcategorySlug,
          description: undefined,
          image: product.image,
        })
      }
    }

    grouped.set(product.category, existing)
  })

  return Array.from(grouped.values()).sort((left, right) => left.name.localeCompare(right.name))
}