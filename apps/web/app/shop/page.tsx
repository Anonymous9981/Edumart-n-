import { MarketingPageShell } from '../../components/marketing-page-shell'
import { ShopCatalog, type ShopCategory } from '../../components/shop-catalog'
import { getHomepageData } from '../homepage-loader'
import { buildCatalogCategories } from '../../lib/supabase/public-catalog'

export const dynamic = 'force-dynamic'

export default async function ShopPage() {
  const data = await getHomepageData({ take: 1000 })
  const categories = buildCatalogCategories(data.products) as ShopCategory[]
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
