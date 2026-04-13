import Link from 'next/link'
import { notFound } from 'next/navigation'

import { MarketingPageShell } from '../../../components/marketing-page-shell'
import { ProductDetailActions } from '../../../components/ui/product-detail-actions'
import { ProductCard } from '../../../components/ui/product-card'
import { getHomepageData } from '../../homepage-loader'

export const dynamic = 'force-dynamic'

const INR = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

function getAccent(audience: 'student' | 'teacher') {
  return audience === 'student' ? 'blue' : 'green'
}

function getOfferSummary(product: Awaited<ReturnType<typeof getHomepageData>>['products'][number]) {
  const discountLabel =
    product.discountType === 'FIXED'
      ? `${INR.format(product.discountValue ?? 0)} OFF`
      : `${product.discountPercentage}% OFF`

  return {
    currentPrice: INR.format(product.finalPrice),
    originalPrice: INR.format(product.price),
    discountLabel,
  }
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const data = await getHomepageData()
  const product = data.products.find((item) => item.slug === params.slug)

  if (!product) {
    notFound()
  }

  const relatedProducts = data.products
    .filter((item) => item.slug !== product.slug)
    .filter((item) => item.audience === product.audience || item.category === product.category)
    .slice(0, 4)

  const offer = getOfferSummary(product)
  const accent = getAccent(product.audience)
  const heroMedia = product.sceneVideoUrl ? (
    <video
      className="h-full w-full object-cover"
      src={product.sceneVideoUrl}
      controls
      autoPlay
      muted
      loop
      playsInline
      poster={product.image}
    />
  ) : (
    <img src={product.image} alt={product.title} className="h-full w-full object-cover transition duration-700 hover:scale-[1.03]" />
  )

  return (
    <MarketingPageShell
      eyebrow="Product Details"
      title={product.title}
      subtitle={product.description}
      accent={accent}
      primaryCta={{ label: 'Continue Shopping', href: '/shop' }}
      secondaryCta={{ label: 'Wishlist', href: '/wishlist' }}
    >
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="space-y-6">
          <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
            <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
              {heroMedia}
              <div className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-900 shadow-sm">
                {product.audience === 'student' ? 'Student product' : 'School product'}
              </div>
              <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-slate-950/85 px-3 py-1 text-xs font-bold text-white backdrop-blur">
                  {product.category}
                </span>
                <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-slate-900 shadow-sm">
                  {product.rating.toFixed(1)} star rating
                </span>
                <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-slate-900 shadow-sm">
                  {product.reviews.toLocaleString('en-IN')} reviews
                </span>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ['Vendor', product.vendor],
              ['Category', product.category],
              ['Audience', product.audience === 'student' ? 'Students' : 'Schools'],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{label}</p>
                <p className="mt-2 text-base font-extrabold text-slate-900">{value}</p>
              </div>
            ))}
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
            <h2 className="text-2xl font-extrabold text-slate-900">About this product</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">{product.description}</p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Product highlights</p>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                  <li>Premium quality with clear pricing</li>
                  <li>Quick add to cart or wishlist flow</li>
                  <li>Optimized for mobile and desktop browsing</li>
                </ul>
              </div>
              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Recommended for</p>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                  <li>{product.audience === 'student' ? 'Student learning and revision' : 'School planning and procurement'}</li>
                  <li>{product.schoolClasses?.length ? `Best for classes ${product.schoolClasses.join(', ')}` : 'Suitable for multiple classes'}</li>
                  <li>Fast comparison with related EduMart products</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <aside className="space-y-5 xl:sticky xl:top-6 xl:self-start">
          <ProductDetailActions product={product} />

          <div className="rounded-[2rem] bg-gradient-to-br from-[#0B3558] to-[#00A67E] p-6 text-white shadow-xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/80">Need a closer look?</p>
            <h2 className="mt-2 text-2xl font-extrabold">Open in cart or wishlist with one tap.</h2>
            <p className="mt-3 text-sm leading-6 text-white/90">
              The product page is optimized for quick comparison, mobile taps and smooth transitions into purchase actions.
            </p>
          </div>
        </aside>
      </div>

      <section className="mt-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">Related products</p>
            <h2 className="mt-2 text-2xl font-extrabold text-slate-900">More from EduMart</h2>
          </div>
          <Link href="/shop" className="text-sm font-bold text-[#0B3558] transition hover:text-[#00A67E]">
            Browse all
          </Link>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {relatedProducts.map((item) => (
            <ProductCard
              key={item.id}
              product={item}
              detailHref={`/product/${item.slug}`}
              priceLabel={INR.format(item.finalPrice)}
              originalPriceLabel={INR.format(item.price)}
              discountLabel={item.discountType === 'FIXED' ? `${INR.format(item.discountValue ?? 0)} OFF` : `${item.discountPercentage}% OFF`}
              actionLabel="Open"
              secondaryActionLabel="Save"
              detailLabel="Quick view"
            />
          ))}
        </div>
      </section>
    </MarketingPageShell>
  )
}
