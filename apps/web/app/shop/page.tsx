import { MarketingPageShell } from '../../components/marketing-page-shell'
import { ProductCard } from '../../components/ui/product-card'
import { FALLBACK_PRODUCTS } from '../homepage-loader'

const CATEGORIES = [
  ['Books', 'Study books and board textbooks'],
  ['Stationery', 'Kits, pens, notebooks and supplies'],
  ['Uniforms', 'School uniforms and accessories'],
  ['Bags', 'Backpacks and travel bags'],
  ['Sports', 'Sports kits and PE items'],
  ['Digital', 'Digital learning tools and devices'],
  ['Workbooks', 'Practice books and revision sets'],
  ['Art & Craft', 'Creative kits, colors and DIY materials'],
  ['Classroom Tech', 'Interactive tools for school rooms'],
  ['School Software', 'Systems for attendance and communication'],
]

const FEATURED_PRODUCTS = FALLBACK_PRODUCTS.slice(0, 12)

export default function ShopPage() {
  return (
    <MarketingPageShell
      eyebrow="Shop"
      title="Browse the full EduMart catalog"
      subtitle="Student products, school products, digital learning and more. Discounts are auto-applied with clear original and final pricing."
      accent="amber"
      primaryCta={{ label: 'School Flow', href: '/schools' }}
      secondaryCta={{ label: 'View Offers', href: '/offers' }}
    >
      <div className="grid gap-5 lg:grid-cols-[0.75fr_1.25fr]">
        <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-extrabold text-slate-900">Categories</h2>
          <div className="mt-4 space-y-3">
            {CATEGORIES.map(([name, description]) => (
              <div key={name} className="rounded-2xl bg-slate-50 p-4">
                <p className="font-bold text-slate-900">{name}</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
              </div>
            ))}
          </div>
        </aside>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {FEATURED_PRODUCTS.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              detailHref={`/product/${product.slug}`}
              priceLabel={`₹${product.finalPrice.toLocaleString('en-IN')}`}
              originalPriceLabel={`₹${product.price.toLocaleString('en-IN')}`}
              discountLabel={product.discountType === 'FIXED' ? `₹${product.discountValue?.toLocaleString('en-IN')} OFF` : `${product.discountPercentage}% OFF`}
              actionLabel="Open Product"
              secondaryActionLabel="Save"
              metaLabel={product.audience === 'student' ? 'Student product' : 'School product'}
            />
          ))}
        </div>
      </div>
    </MarketingPageShell>
  )
}
