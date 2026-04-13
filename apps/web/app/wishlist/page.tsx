"use client"

import { useEffect, useMemo, useState } from 'react'

import { MarketingPageShell } from '../../components/marketing-page-shell'
import { ProductCard } from '../../components/ui/product-card'
import type { HomepageProduct } from '../../lib/homepage-types'
import { resolveProductsByIds, useMarketplaceState } from '../../lib/marketplace-state'

export default function WishlistPage() {
  const marketplace = useMarketplaceState()
  const [catalogProducts, setCatalogProducts] = useState<HomepageProduct[]>([])

  useEffect(() => {
    let active = true

    fetch('/api/v1/products?limit=100', { cache: 'no-store' })
      .then(async (response) => {
        const payload = await response.json().catch(() => null)
        return response.ok ? payload?.data ?? [] : []
      })
      .then((items) => {
        if (active) {
          setCatalogProducts(Array.isArray(items) ? items : [])
        }
      })
      .catch(() => {
        if (active) {
          setCatalogProducts([])
        }
      })

    return () => {
      active = false
    }
  }, [])

  const liveWishlistProducts = useMemo(() => resolveProductsByIds(catalogProducts, marketplace.wishlist), [catalogProducts, marketplace.wishlist])

  const studentCount = liveWishlistProducts.filter((item) => item.audience === 'student').length
  const schoolCount = liveWishlistProducts.filter((item) => item.audience === 'teacher').length

  return (
    <MarketingPageShell
      eyebrow="Wishlist"
      title="Saved products ready for later checkout"
      subtitle="Keep student essentials and school purchases in one place, then move them to cart whenever you are ready."
      accent="teal"
      primaryCta={{ label: 'Continue Shopping', href: '/shop' }}
      secondaryCta={{ label: 'Go to Cart', href: '/cart' }}
    >
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">Wishlist overview</p>
          <h2 className="mt-2 text-3xl font-extrabold text-slate-900">A simple save-for-later shelf</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Wishlist items stay organized by category, so families and schools can compare products before moving them into the cart.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              ['Saved items', `${liveWishlistProducts.length}`],
              ['Student picks', `${studentCount}`],
              ['School picks', `${schoolCount}`],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{label}</p>
                <p className="mt-2 text-2xl font-extrabold text-slate-900">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-3xl bg-slate-900 p-5 text-white">
            <h3 className="text-xl font-extrabold">Why save products first?</h3>
            <p className="mt-2 text-sm leading-6 text-white/85">
              It helps buyers shortlist book bundles, uniforms, classroom tools and school infrastructure before paying.
            </p>
          </div>
        </section>

        <section className="grid gap-5 sm:grid-cols-2">
          {liveWishlistProducts.length ? liveWishlistProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              mode="wishlist"
              detailHref={`/product/${product.slug}`}
              priceLabel={`₹${product.finalPrice.toLocaleString('en-IN')}`}
              originalPriceLabel={`₹${product.price.toLocaleString('en-IN')}`}
              discountLabel={product.discountType === 'FIXED' ? `₹${product.discountValue?.toLocaleString('en-IN')} OFF` : `${product.discountPercentage}% OFF`}
              actionLabel="Move to cart"
              secondaryActionLabel="Remove"
              metaLabel={product.audience === 'student' ? 'Student wishlist' : 'School wishlist'}
            />
          )) : (
            <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm sm:col-span-2">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">Wishlist empty</p>
              <h3 className="mt-3 text-2xl font-extrabold text-slate-900">Save products to compare them later</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Browse the shop, tap save on any product, and it will appear here with live pricing and quick move-to-cart controls.
              </p>
            </div>
          )}
        </section>
      </div>
    </MarketingPageShell>
  )
}
