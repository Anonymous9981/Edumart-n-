"use client"

import Link from 'next/link'

import type { HomepageProduct } from '../../lib/homepage-types'
import { useMarketplaceState } from '../../lib/marketplace-state'
import { useSiteFeedback } from '../../lib/site-feedback'

interface ProductDetailActionsProps {
  product: HomepageProduct
}

const INR = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

export function ProductDetailActions({ product }: ProductDetailActionsProps) {
  const marketplace = useMarketplaceState()
  const feedback = useSiteFeedback()
  const inCart = marketplace.isInCart(product.id)
  const inWishlist = marketplace.isInWishlist(product.id)
  const savings = INR.format(product.price - product.finalPrice)

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Live pricing</p>
          <div className="mt-2 flex flex-wrap items-end gap-2">
            <span className="text-4xl font-extrabold text-slate-900">{INR.format(product.finalPrice)}</span>
            <span className="text-sm text-slate-400 line-through">{INR.format(product.price)}</span>
          </div>
          <p className="mt-2 text-sm font-semibold text-emerald-700">{savings} saved already</p>
        </div>
        <div className="rounded-2xl bg-slate-50 px-4 py-3 text-right">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Saved</p>
          <p className="mt-1 text-lg font-extrabold text-emerald-700">{savings}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          className="rounded-xl bg-[#0B3558] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#082b49]"
          onClick={() => {
            const added = marketplace.addToCart(product.id, 1)

            if (added) {
              feedback.notifySuccess('Added to cart', `${product.title} is now in your cart.`)
              return
            }

            feedback.notifyWarning('Already in cart', `${product.title} is already saved in your cart.`)
          }}
        >
          {inCart ? 'Already in cart' : 'Add to cart'}
        </button>
        <button
          type="button"
          className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
          onClick={() => {
            marketplace.toggleWishlist(product.id)
            feedback.notifyInfo(inWishlist ? 'Removed from wishlist' : 'Saved to wishlist', inWishlist ? `${product.title} has been removed from your wishlist.` : `${product.title} is now available in your wishlist.`)
          }}
        >
          {inWishlist ? 'Saved to wishlist' : 'Save to wishlist'}
        </button>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {[
          ['Delivery', 'Fast dispatch'],
          ['Support', '1 business day'],
          ['Returns', 'Easy assistance'],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl bg-slate-50 p-4 text-center">
            <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-slate-500">{label}</p>
            <p className="mt-2 text-sm font-semibold text-slate-900">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-3 text-sm font-bold">
        <Link href="/cart" className="rounded-xl bg-slate-900 px-4 py-2 text-white transition hover:bg-slate-800">
          Open cart
        </Link>
        <Link href="/wishlist" className="rounded-xl border border-slate-300 px-4 py-2 text-slate-700 transition hover:bg-slate-50">
          Open wishlist
        </Link>
      </div>
    </div>
  )
}
