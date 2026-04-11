import { MarketingPageShell } from '../../components/marketing-page-shell'
import { ShopCatalog, type ShopCategory } from '../../components/shop-catalog'
import { EDUMART_CATALOG_TAXONOMY } from '@edumart/shared'
import { prisma } from '../../lib/prisma'
import { FALLBACK_PRODUCTS } from '../homepage-loader'

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1200&q=80'

function buildFallbackCategories(): ShopCategory[] {
  return EDUMART_CATALOG_TAXONOMY
    .slice()
    .sort((a, b) => a.priority - b.priority || a.name.localeCompare(b.name))
    .map((category) => ({
      id: `fallback-category-${category.legacyId}`,
      name: category.name,
      slug: category.slug,
      description: `Explore ${category.name.toLowerCase()} options for students and schools.`,
      image: FALLBACK_PRODUCTS.find((product) => product.category === category.name)?.image ?? FALLBACK_IMAGE,
      subcategories: category.subcategories
        .slice()
        .sort((a, b) => a.priority - b.priority || a.name.localeCompare(b.name))
        .map((subcategory) => ({
          id: `fallback-subcategory-${subcategory.legacyId}`,
          name: subcategory.name,
          slug: subcategory.slug,
          description: `Top picks from ${subcategory.name.toLowerCase()}.`,
          image:
            FALLBACK_PRODUCTS.find((product) => product.subcategory === subcategory.name)?.image ??
            FALLBACK_PRODUCTS.find((product) => product.category === category.name)?.image ??
            FALLBACK_IMAGE,
        })),
    }))
}

async function getShopCategories(): Promise<ShopCategory[]> {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true, parentId: null },
      include: {
        children: {
          where: { isActive: true },
          orderBy: [{ displayOrder: 'asc' }, { name: 'asc' }],
        },
      },
      orderBy: [{ displayOrder: 'asc' }, { name: 'asc' }],
    })

    if (!categories.length) {
      return buildFallbackCategories()
    }

    const dbCategories = categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      image: category.image,
      subcategories: category.children.map((subcategory) => ({
        id: subcategory.id,
        name: subcategory.name,
        slug: subcategory.slug,
        description: subcategory.description,
        image: subcategory.image,
      })),
    }))

    const fallbackCategories = buildFallbackCategories()
    const mergedCategories = [
      ...dbCategories,
      ...fallbackCategories.filter((fallbackCategory) => !dbCategories.some((dbCategory) => dbCategory.slug === fallbackCategory.slug)),
    ]

    return mergedCategories
  } catch {
    return buildFallbackCategories()
  }
}

export default async function ShopPage() {
  const categories = await getShopCategories()
  const featuredProducts = FALLBACK_PRODUCTS.slice(0, 12)

  return (
    <MarketingPageShell
      eyebrow="Shop"
      title="Browse the full EduMart catalog"
      subtitle="Student products, school products, digital learning and more. Discounts are auto-applied with clear original and final pricing."
      accent="amber"
      primaryCta={{ label: 'School Flow', href: '/schools' }}
      secondaryCta={{ label: 'View Offers', href: '/offers' }}
    >
      <ShopCatalog products={featuredProducts} categories={categories} />
    </MarketingPageShell>
  )
}
