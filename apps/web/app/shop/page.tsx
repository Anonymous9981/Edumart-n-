import { MarketingPageShell } from '../../components/marketing-page-shell'
import { ShopCatalog, type ShopCategory } from '../../components/shop-catalog'
import { prisma } from '../../lib/prisma'
import { FALLBACK_PRODUCTS } from '../homepage-loader'

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1200&q=80'

function buildFallbackCategories(): ShopCategory[] {
  const unique = Array.from(new Set(FALLBACK_PRODUCTS.map((product) => product.category)))

  return unique.map((name, index) => ({
    id: `fallback-category-${index}`,
    name,
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    description: `Explore ${name.toLowerCase()} options for students and schools.`,
    image: FALLBACK_PRODUCTS.find((product) => product.category === name)?.image ?? FALLBACK_IMAGE,
    subcategories: [
      {
        id: `fallback-subcategory-${index}`,
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: `Top picks from ${name.toLowerCase()}.`,
        image: FALLBACK_PRODUCTS.find((product) => product.category === name)?.image ?? FALLBACK_IMAGE,
      },
    ],
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

    return categories.map((category) => ({
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
