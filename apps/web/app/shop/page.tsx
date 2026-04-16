import { MarketingPageShell } from '../../components/marketing-page-shell'
import { ShopCatalog, type ShopCategory } from '../../components/shop-catalog'
import { prisma } from '../../lib/prisma'
import { getHomepageData } from '../homepage-loader'

export const dynamic = 'force-dynamic'

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
      return []
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
    return dbCategories
  } catch {
    return []
  }
}

export default async function ShopPage() {
  const categories = await getShopCategories()
  const data = await getHomepageData({ take: 200 })
  const featuredProducts = data.products

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
