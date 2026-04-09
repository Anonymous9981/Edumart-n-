"use client"

import Link from 'next/link'
import type { HomepageProduct } from '../../lib/homepage-types'
import { useMarketplaceState } from '../../lib/marketplace-state'
import { useSiteFeedback } from '../../lib/site-feedback'

interface ProductCardProps {
  product: HomepageProduct
  mode?: 'catalog' | 'spotlight' | 'wishlist' | 'cart'
  discountLabel?: string
  priceLabel?: string
  originalPriceLabel?: string
  actionLabel?: string
  secondaryActionLabel?: string
  quantity?: number
  metaLabel?: string
  detailHref?: string
  detailLabel?: string
}

export function ProductCard({
  product,
  mode = 'catalog',
  discountLabel,
  priceLabel,
  originalPriceLabel,
  actionLabel = 'Add to cart',
  secondaryActionLabel,
  quantity = 1,
  metaLabel,
  detailHref,
  detailLabel = 'View details',
}: ProductCardProps) {
  const marketplace = useMarketplaceState()
  const feedback = useSiteFeedback()
  const inCart = marketplace.isInCart(product.id)
  const inWishlist = marketplace.isInWishlist(product.id)

  if (mode === 'spotlight' && product.slug === 'plantorium-event-for-school-kids') {
    return (
      <article className="group brand-hover-lift overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md shadow-slate-900/5 transition-all duration-300">
        <div className="relative bg-slate-950 p-3">
          <div className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-slate-900">
            360° Scene Preview
          </div>
          <video
            className="h-56 w-full rounded-2xl object-cover"
            src={product.sceneVideoUrl}
            controls
            autoPlay
            muted
            loop
            playsInline
          />
        </div>
        <div className="p-5">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">{product.vendor}</p>
          <Link href={detailHref ?? `/product/${product.slug}`} className="mt-2 block text-xl font-extrabold text-slate-900 transition hover:text-[#0B3558]">
            {product.title}
          </Link>
          <p className="mt-2 text-sm leading-6 text-slate-600">{product.description}</p>
          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#00A67E]">
            Plantorium is presented as a 360 scene experience for school kids.
          </p>
        </div>
      </article>
    )
  }

  if (mode === 'spotlight') {
    return (
      <article className="group brand-hover-lift overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md shadow-slate-900/5 transition-all duration-300">
        <div className="group relative">
          <img src={product.image} alt={product.title} className="h-56 w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
          <Link
            href={detailHref ?? `/product/${product.slug}`}
            className="absolute inset-x-4 bottom-4 inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-bold text-slate-900 opacity-0 shadow-lg transition group-hover:opacity-100"
          >
            {detailLabel}
          </Link>
        </div>
        <div className="p-5">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">{product.vendor}</p>
          <Link href={detailHref ?? `/product/${product.slug}`} className="mt-2 block text-xl font-extrabold text-slate-900 transition hover:text-[#0B3558]">
            {product.title}
          </Link>
          <p className="mt-2 text-sm leading-6 text-slate-600">{product.description}</p>
        </div>
      </article>
    )
  }

  if (mode === 'cart') {
    return (
      <article className="brand-hover-lift overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md shadow-slate-900/5 transition-all duration-300">
        <div className="grid gap-4 p-5 sm:grid-cols-[120px_1fr] sm:items-center">
          <Link href={detailHref ?? `/product/${product.slug}`} className="relative block overflow-hidden rounded-2xl">
            <img src={product.image} alt={product.title} className="h-36 w-full object-cover transition duration-500 hover:scale-[1.03] sm:h-32" />
            <span className="absolute inset-x-3 bottom-3 rounded-full bg-white/95 px-3 py-1 text-center text-[0.7rem] font-bold uppercase tracking-[0.18em] text-slate-900 opacity-0 transition hover:opacity-100 sm:group-hover:opacity-100">
              {detailLabel}
            </span>
          </Link>
          <div>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">{product.vendor}</p>
                <Link href={detailHref ?? `/product/${product.slug}`} className="mt-2 block text-lg font-extrabold leading-tight text-slate-900 transition hover:text-[#0B3558]">
                  {product.title}
                </Link>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.15em] text-[#00A67E]">{metaLabel ?? product.category}</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">Qty {quantity}</span>
            </div>

            <div className="mt-3 flex flex-wrap items-end gap-2">
              <span className="text-2xl font-extrabold text-slate-900">{priceLabel}</span>
              <span className="text-sm text-slate-400 line-through">{originalPriceLabel}</span>
              <span className="text-xs font-bold text-emerald-700">{discountLabel}</span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50" onClick={() => marketplace.decrementCartItem(product.id)}>
                -
              </button>
              <button type="button" className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50" onClick={() => marketplace.increaseCartQuantity(product.id, 1)}>
                +
              </button>
              <button
                type="button"
                className="rounded-xl bg-[#0B3558] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#082b49]"
                onClick={() => {
                  marketplace.addToWishlist(product.id)
                  feedback.notifySuccess('Saved to wishlist', `${product.title} is now available in your wishlist.`)
                  marketplace.removeFromCart(product.id)
                }}
              >
                Move to wishlist
              </button>
              <button type="button" className="rounded-xl border border-rose-200 px-4 py-2 text-sm font-bold text-rose-700 transition hover:bg-rose-50" onClick={() => {
                marketplace.removeFromCart(product.id)
                feedback.notifyInfo('Removed from cart', `${product.title} has been removed from your cart.`)
              }}>
                Remove
              </button>
            </div>
          </div>
        </div>
      </article>
    )
  }

  if (mode === 'wishlist') {
    return (
      <article className="brand-hover-lift overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md shadow-slate-900/5 transition-all duration-300">
        <div className="relative">
          <Link href={detailHref ?? `/product/${product.slug}`} className="block">
            <img src={product.image} alt={product.title} className="h-56 w-full object-cover transition duration-500 hover:scale-[1.03]" />
          </Link>
          <div className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-slate-900 shadow-sm">
            Saved for later
          </div>
        </div>
        <div className="p-5">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">{product.vendor}</p>
          <Link href={detailHref ?? `/product/${product.slug}`} className="mt-2 block text-xl font-extrabold leading-tight text-slate-900 transition hover:text-[#0B3558]">
            {product.title}
          </Link>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.15em] text-[#00A67E]">{metaLabel ?? product.category}</p>

          <div className="mt-2 flex items-center gap-2 text-sm">
            <span className="rounded bg-green-600 px-2 py-0.5 font-bold text-white">{product.rating.toFixed(1)}</span>
            <span className="text-slate-600">({product.reviews.toLocaleString('en-IN')} reviews)</span>
          </div>

          <div className="mt-3 flex items-end gap-2">
            <span className="text-2xl font-extrabold text-slate-900">{priceLabel}</span>
            <span className="text-sm text-slate-400 line-through">{originalPriceLabel}</span>
          </div>

          <p className="mt-1 text-sm font-semibold text-[#00A67E]">{discountLabel}</p>

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              className="rounded-xl bg-[#0B3558] px-4 py-2 text-sm font-bold text-white transition hover:scale-[1.01] hover:bg-[#082b49]"
              onClick={() => {
                const added = marketplace.addToCart(product.id, 1)
                if (added) {
                  feedback.notifySuccess('Added to cart', `${product.title} is ready in your cart.`)
                  return
                }

                feedback.notifyWarning('Already in cart', `${product.title} is already saved in your cart.`)
              }}
            >
              {actionLabel}
            </button>
            <button
              type="button"
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              onClick={() => {
                marketplace.removeFromWishlist(product.id)
                feedback.notifyInfo('Removed from wishlist', `${product.title} has been removed from your wishlist.`)
              }}
            >
              {secondaryActionLabel ?? 'Remove'}
            </button>
          </div>
        </div>
      </article>
    )
  }

  return (
    <article className="brand-hover-lift overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md shadow-slate-900/5 transition-all duration-300">
      <div className="group relative">
        <Link href={detailHref ?? `/product/${product.slug}`} className="block">
          <img src={product.image} alt={product.title} className="h-56 w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
        </Link>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
        <Link
          href={detailHref ?? `/product/${product.slug}`}
          className="absolute inset-x-4 bottom-4 inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-bold text-slate-900 opacity-0 shadow-lg transition group-hover:opacity-100"
        >
          {detailLabel}
        </Link>
      </div>
      <div className="p-5">
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">{product.vendor}</p>
        <Link href={detailHref ?? `/product/${product.slug}`} className="mt-2 block text-xl font-extrabold leading-tight text-slate-900 transition hover:text-[#0B3558]">
          {product.title}
        </Link>
        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.15em] text-[#00A67E]">
          {product.audience === 'student' ? 'Student product' : 'Teacher product'}
        </p>

        <div className="mt-2 flex items-center gap-2 text-sm">
          <span className="rounded bg-green-600 px-2 py-0.5 font-bold text-white">{product.rating.toFixed(1)}</span>
          <span className="text-slate-600">({product.reviews.toLocaleString('en-IN')} reviews)</span>
        </div>

        <div className="mt-3 flex items-end gap-2">
          <span className="text-2xl font-extrabold text-slate-900">{priceLabel}</span>
          <span className="text-sm text-slate-400 line-through">{originalPriceLabel}</span>
        </div>

        <p className="mt-1 text-sm font-semibold text-[#00A67E]">{discountLabel}</p>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            className="rounded-xl bg-[#0B3558] px-4 py-2 text-sm font-bold text-white transition hover:scale-[1.01] hover:bg-[#082b49]"
              onClick={() => {
                const added = marketplace.addToCart(product.id, 1)
                if (added) {
                  marketplace.removeFromWishlist(product.id)
                  feedback.notifySuccess('Moved to cart', `${product.title} has been moved to your cart.`)
                  return
                }

                feedback.notifyWarning('Already in cart', `${product.title} is already saved in your cart.`)
              }}
          >
            {inCart ? 'Already in cart' : actionLabel}
          </button>
          <button
            type="button"
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            onClick={() => {
              marketplace.toggleWishlist(product.id)
              feedback.notifyInfo(inWishlist ? 'Removed from wishlist' : 'Saved to wishlist', inWishlist ? `${product.title} has been removed from your wishlist.` : `${product.title} is now available in your wishlist.`)
            }}
          >
            {inWishlist ? 'Saved' : secondaryActionLabel ?? 'Save'}
          </button>
        </div>
      </div>
    </article>
  )
}
