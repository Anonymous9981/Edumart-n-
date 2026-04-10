"use client"

import Link from 'next/link'
import { useMemo } from 'react'

import { MarketingPageShell } from '../../components/marketing-page-shell'
import { ProductCard } from '../../components/ui/product-card'
import { FALLBACK_PRODUCTS } from '../homepage-loader'
import { resolveProductsByIds, useMarketplaceState } from '../../lib/marketplace-state'
import { useSiteFeedback } from '../../lib/site-feedback'

export default function CartPage() {
  const marketplace = useMarketplaceState()
  const feedback = useSiteFeedback()
  const cartItems = useMemo(() => {
    return Object.entries(marketplace.cart)
      .map(([productId, quantity]) => ({
        product: resolveProductsByIds(FALLBACK_PRODUCTS, [productId])[0],
        quantity,
      }))
      .filter((item): item is { product: (typeof FALLBACK_PRODUCTS)[number]; quantity: number } => Boolean(item.product))
  }, [marketplace.cart])

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.finalPrice * item.quantity, 0)
  const shipping = cartItems.length > 0 ? 0 : 0
  const discount = cartItems.length > 0 ? Math.min(850, subtotal) : 0
  const total = Math.max(subtotal + shipping - discount, 0)

  return (
    <MarketingPageShell
      eyebrow="Cart"
      title="Review items before checkout"
      subtitle="Your cart groups student products and school purchases into a clean, ready-to-order summary."
      accent="navy"
      primaryCta={{ label: 'Continue Shopping', href: '/shop' }}
      secondaryCta={{ label: 'Wishlist', href: '/wishlist' }}
    >
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="space-y-4">
          {cartItems.length ? cartItems.map(({ product, quantity }) => (
            <ProductCard
              key={product.id}
              product={product}
              mode="cart"
              detailHref={`/product/${product.slug}`}
              quantity={quantity}
              priceLabel={`₹${product.finalPrice.toLocaleString('en-IN')}`}
              originalPriceLabel={`₹${product.price.toLocaleString('en-IN')}`}
              discountLabel={product.discountType === 'FIXED' ? `₹${product.discountValue?.toLocaleString('en-IN')} OFF` : `${product.discountPercentage}% OFF`}
              metaLabel={product.audience === 'student' ? 'Student cart item' : 'School cart item'}
            />
          )) : (
            <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">Cart empty</p>
              <h3 className="mt-3 text-2xl font-extrabold text-slate-900">Add products from the shop or wishlist</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Once items are added, the cart will calculate totals here and keep quantities in sync across the app.
              </p>
            </div>
          )}
        </section>

        <aside className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">Order summary</p>
          <h2 className="mt-2 text-3xl font-extrabold text-slate-900">Cart totals</h2>

          <div className="mt-6 space-y-3 rounded-3xl bg-slate-50 p-5 text-sm text-slate-700">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span className="font-bold text-slate-900">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Shipping</span>
              <span className="font-bold text-emerald-700">Free</span>
            </div>
            <div className="flex items-center justify-between">
              <span>EduMart discount</span>
              <span className="font-bold text-rose-600">-₹{discount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-base">
              <span className="font-semibold text-slate-900">Total</span>
              <span className="text-xl font-extrabold text-slate-900">₹{total.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <Link
            href="/checkout"
            className={`mt-5 block w-full rounded-xl px-5 py-3 text-center text-sm font-bold text-white shadow-sm ${
              cartItems.length ? 'bg-[#0B3558]' : 'pointer-events-none bg-slate-400'
            }`}
            onClick={(event) => {
              if (!cartItems.length) {
                event.preventDefault()
                feedback.notifyWarning('Cart is empty', 'Add items to cart before moving to checkout.')
              }
            }}
          >
            Proceed to checkout
          </Link>

          <button
            type="button"
            className="mt-3 w-full rounded-xl border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            onClick={() => marketplace.clearCart()}
          >
            Clear cart
          </button>

          <div className="mt-5 rounded-3xl border border-slate-200 bg-white p-5">
            <h3 className="text-lg font-extrabold text-slate-900">Checkout notes</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Bulk orders, school procurement and standard family orders can all share the same cart framework. Use checkout
              to add delivery address and place your order with Cash on Delivery.
            </p>
          </div>
        </aside>
      </div>
    </MarketingPageShell>
  )
}
