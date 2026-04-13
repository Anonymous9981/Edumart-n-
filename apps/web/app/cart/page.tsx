"use client"

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { MarketingPageShell } from '../../components/marketing-page-shell'
import { useSiteFeedback } from '../../lib/site-feedback'
import { useRealtimeRefresh } from '../../lib/supabase/realtime'

interface CartApiItem {
  id: string
  quantity: number
  product: {
    id: string
    slug: string
    name: string
    tags: string[]
    basePrice: number
    finalPrice: number
    discountPercentage: number
    category: { name: string }
    vendor: { storeName: string }
    images: Array<{ imageUrl: string }>
  }
}

function toCardProduct(item: CartApiItem) {
  const audience = item.product.tags.includes('audience:teacher') ? 'teacher' : 'student'
  return {
    id: item.product.id,
    slug: item.product.slug,
    title: item.product.name,
    vendor: item.product.vendor.storeName,
    category: item.product.category.name,
    audience,
    image: item.product.images[0]?.imageUrl ?? 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1200&q=80',
    rating: 4.6,
    reviews: 1,
    price: item.product.basePrice,
    finalPrice: item.product.finalPrice,
    discountPercentage: item.product.discountPercentage,
    discountType: 'PERCENTAGE' as const,
    discountValue: item.product.discountPercentage,
    description: item.product.name,
    featured: false,
  }
}

export default function CartPage() {
  const feedback = useSiteFeedback()
  const [items, setItems] = useState<CartApiItem[]>([])
  const [loading, setLoading] = useState(true)
  const [authRequired, setAuthRequired] = useState(false)

  const fetchCart = useCallback(async () => {
    try {
      const response = await fetch('/api/v1/cart', { cache: 'no-store' })
      const payload = await response.json()

      if (!response.ok) {
        if (response.status === 401) {
          setAuthRequired(true)
          setItems([])
          return
        }
        throw new Error(payload?.error?.message ?? 'Unable to load cart')
      }

      setAuthRequired(false)
      setItems(payload?.data?.items ?? [])
    } catch (error) {
      feedback.notify({
        title: 'Cart load failed',
        message: error instanceof Error ? error.message : 'Unable to fetch cart',
        tone: 'error',
      })
    } finally {
      setLoading(false)
    }
  }, [feedback])

  const realtimeTables = useMemo(
    () => [
      { table: 'CartItem' as const },
      { table: 'Product' as const },
      { table: 'VendorProfile' as const },
    ],
    [],
  )

  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  useRealtimeRefresh(
    'edumart-cart-live-refresh',
    realtimeTables,
    () => {
      fetchCart()
    },
    !authRequired,
  )

  const cartItems = useMemo(() => {
    return items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      product: toCardProduct(item),
    }))
  }, [items])

  async function updateQuantity(itemId: string, nextQuantity: number) {
    const response = await fetch('/api/v1/cart/items', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemId, quantity: nextQuantity }),
    })

    if (!response.ok) {
      const payload = await response.json().catch(() => null)
      throw new Error(payload?.error?.message ?? 'Unable to update cart item')
    }

    await fetchCart()
  }

  async function clearCart() {
    const response = await fetch('/api/v1/cart', { method: 'DELETE' })
    if (!response.ok) {
      const payload = await response.json().catch(() => null)
      throw new Error(payload?.error?.message ?? 'Unable to clear cart')
    }

    await fetchCart()
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.finalPrice * item.quantity, 0)
  const shipping = cartItems.length > 0 ? 0 : 0
  const discount = cartItems.length > 0 ? Math.min(850, subtotal) : 0
  const total = Math.max(subtotal + shipping - discount, 0)

  if (authRequired) {
    return (
      <MarketingPageShell
        eyebrow="Cart"
        title="Sign in to access your live cart"
        subtitle="Cart data is synced in real time from the database for authenticated users."
        accent="navy"
        primaryCta={{ label: 'Go to login', href: '/login?from=/cart' }}
        secondaryCta={{ label: 'Continue shopping', href: '/shop' }}
      >
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 text-sm text-slate-600 shadow-sm">
          Your cart is now database-backed. Please sign in to view and sync items across devices.
        </div>
      </MarketingPageShell>
    )
  }

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
          {loading ? (
            <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
              <p className="text-sm font-semibold text-slate-600">Loading your cart...</p>
            </div>
          ) : null}
          {cartItems.length ? cartItems.map(({ id, product, quantity }) => (
            <article key={id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="grid gap-4 sm:grid-cols-[120px_1fr] sm:items-center">
                <Link href={`/product/${product.slug}`} className="block overflow-hidden rounded-2xl">
                  <img src={product.image} alt={product.title} className="h-32 w-full object-cover" />
                </Link>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">{product.vendor}</p>
                  <Link href={`/product/${product.slug}`} className="mt-2 block text-lg font-extrabold text-slate-900">
                    {product.title}
                  </Link>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.15em] text-[#00A67E]">
                    {product.audience === 'student' ? 'Student cart item' : 'School cart item'}
                  </p>

                  <div className="mt-3 flex flex-wrap items-end gap-2">
                    <span className="text-2xl font-extrabold text-slate-900">₹{product.finalPrice.toLocaleString('en-IN')}</span>
                    <span className="text-sm text-slate-400 line-through">₹{product.price.toLocaleString('en-IN')}</span>
                    <span className="text-xs font-bold text-emerald-700">{product.discountPercentage}% OFF</span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                      onClick={() => {
                        updateQuantity(id, quantity - 1).catch((error) => {
                          feedback.notify({
                            title: 'Unable to update cart',
                            message: error instanceof Error ? error.message : 'Try again',
                            tone: 'error',
                          })
                        })
                      }}
                    >
                      -
                    </button>
                    <span className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700">Qty {quantity}</span>
                    <button
                      type="button"
                      className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                      onClick={() => {
                        updateQuantity(id, quantity + 1).catch((error) => {
                          feedback.notify({
                            title: 'Unable to update cart',
                            message: error instanceof Error ? error.message : 'Try again',
                            tone: 'error',
                          })
                        })
                      }}
                    >
                      +
                    </button>
                    <button
                      type="button"
                      className="rounded-xl border border-rose-200 px-4 py-2 text-sm font-bold text-rose-700 transition hover:bg-rose-50"
                      onClick={() => {
                        updateQuantity(id, 0).catch((error) => {
                          feedback.notify({
                            title: 'Unable to remove item',
                            message: error instanceof Error ? error.message : 'Try again',
                            tone: 'error',
                          })
                        })
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </article>
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
            onClick={() => {
              clearCart().catch((error) => {
                feedback.notify({
                  title: 'Unable to clear cart',
                  message: error instanceof Error ? error.message : 'Try again',
                  tone: 'error',
                })
              })
            }}
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
