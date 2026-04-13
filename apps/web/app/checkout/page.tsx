"use client"

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

import { MarketingPageShell } from '../../components/marketing-page-shell'
import type { HomepageProduct } from '../../lib/homepage-types'
import { resolveProductsByIds, useMarketplaceState } from '../../lib/marketplace-state'
import { useSiteFeedback } from '../../lib/site-feedback'

type AddressForm = {
  fullName: string
  phone: string
  line1: string
  city: string
  state: string
  pincode: string
}

const INITIAL_ADDRESS: AddressForm = {
  fullName: '',
  phone: '',
  line1: '',
  city: '',
  state: '',
  pincode: '',
}

export default function CheckoutPage() {
  const router = useRouter()
  const marketplace = useMarketplaceState()
  const feedback = useSiteFeedback()
  const [catalogProducts, setCatalogProducts] = useState<HomepageProduct[]>([])

  const [address, setAddress] = useState<AddressForm>(INITIAL_ADDRESS)
  const [placingOrder, setPlacingOrder] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'cod'>('cod')

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

  const cartItems = useMemo(() => {
    return Object.entries(marketplace.cart)
      .map(([productId, quantity]) => ({
        product: resolveProductsByIds(catalogProducts, [productId])[0],
        quantity,
      }))
        .filter((item): item is { product: HomepageProduct; quantity: number } => Boolean(item.product))
  }, [catalogProducts, marketplace.cart])

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.finalPrice * item.quantity, 0)
  const shipping = 0
  const discount = cartItems.length > 0 ? Math.min(850, subtotal) : 0
  const total = Math.max(subtotal + shipping - discount, 0)

  function updateAddress<K extends keyof AddressForm>(key: K, value: AddressForm[K]) {
    setAddress((current) => ({ ...current, [key]: value }))
  }

  function validateAddress() {
    return (
      address.fullName.trim().length >= 3 &&
      address.phone.trim().length >= 10 &&
      address.line1.trim().length >= 6 &&
      address.city.trim().length >= 2 &&
      address.state.trim().length >= 2 &&
      address.pincode.trim().length >= 6
    )
  }

  async function placeOrder() {
    if (!cartItems.length) {
      feedback.notifyWarning('Cart is empty', 'Please add products before placing order.')
      return
    }

    if (!validateAddress()) {
      feedback.notifyWarning('Incomplete address', 'Fill complete delivery details before placing your order.')
      return
    }

    setPlacingOrder(true)

    try {
      const response = await fetch('/api/v1/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address,
          paymentMethod,
          totals: {
            subtotal,
            shipping,
            discount,
            total,
          },
          items: cartItems.map((item) => ({ productId: item.product.id, quantity: item.quantity })),
        }),
      })

      const payload = await response.json()

      if (!response.ok || !payload?.success || !payload?.data?.orderId) {
        throw new Error(payload?.error?.message || 'Order placement failed')
      }

      marketplace.clearCart()
      router.push(`/order-success?orderId=${encodeURIComponent(payload.data.orderId)}`)
    } catch (error) {
      feedback.notifyWarning('Order failed', error instanceof Error ? error.message : 'Unable to place order right now.')
    } finally {
      setPlacingOrder(false)
    }
  }

  return (
    <MarketingPageShell
      eyebrow="Checkout"
      title="Delivery address and payment"
      subtitle="Confirm your address and place order securely with Cash on Delivery."
      accent="blue"
      primaryCta={{ label: 'Back to Cart', href: '/cart' }}
      secondaryCta={{ label: 'Continue Shopping', href: '/shop' }}
    >
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-extrabold text-slate-900">Delivery address</h2>
          <p className="mt-1 text-sm text-slate-600">We will deliver your order to this address.</p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <input className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none" placeholder="Full name" value={address.fullName} onChange={(event) => updateAddress('fullName', event.target.value)} />
            <input className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none" placeholder="Phone number" value={address.phone} onChange={(event) => updateAddress('phone', event.target.value)} />
            <input className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none sm:col-span-2" placeholder="Address line" value={address.line1} onChange={(event) => updateAddress('line1', event.target.value)} />
            <input className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none" placeholder="City" value={address.city} onChange={(event) => updateAddress('city', event.target.value)} />
            <input className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none" placeholder="State" value={address.state} onChange={(event) => updateAddress('state', event.target.value)} />
            <input className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none sm:col-span-2" placeholder="Pincode" value={address.pincode} onChange={(event) => updateAddress('pincode', event.target.value)} />
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="text-sm font-extrabold uppercase tracking-[0.16em] text-slate-600">Payment option</h3>
            <label className="mt-3 flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 text-sm font-semibold text-slate-800">
              <input
                type="radio"
                checked={paymentMethod === 'cod'}
                onChange={() => setPaymentMethod('cod')}
              />
              Cash on Delivery (COD)
            </label>
          </div>
        </section>

        <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-extrabold text-slate-900">Order summary</h2>
          <div className="mt-4 space-y-2 text-sm text-slate-700">
            <div className="flex items-center justify-between">
              <span>Items</span>
              <span>{cartItems.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span className="font-semibold">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Discount</span>
              <span className="font-semibold text-rose-600">-₹{discount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Shipping</span>
              <span className="font-semibold text-emerald-700">Free</span>
            </div>
            <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-base font-extrabold text-slate-900">
              <span>Total</span>
              <span>₹{total.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <button
            type="button"
            disabled={placingOrder || !cartItems.length}
            className="mt-6 w-full rounded-xl bg-[#0B3558] px-5 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-400"
            onClick={placeOrder}
          >
            {placingOrder ? 'Placing order...' : 'Place order'}
          </button>

          <Link href="/cart" className="mt-3 block text-center text-sm font-semibold text-slate-600 underline-offset-4 hover:underline">
            Edit cart
          </Link>
        </aside>
      </div>
    </MarketingPageShell>
  )
}
