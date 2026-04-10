"use client"

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

import { MarketingPageShell } from '../../components/marketing-page-shell'

interface LastOrder {
  id: string
  orderNumber: string
  paymentStatus: string
  status: string
  total: number
  itemCount: number
  shippingAddress: {
    fullName: string
    line1: string
    city: string
    state: string
    pincode: string
  } | null
}

export default function OrderSuccessPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')
  const [order, setOrder] = useState<LastOrder | null>(null)
  const [loading, setLoading] = useState(Boolean(orderId))

  useEffect(() => {
    async function loadOrder() {
      if (!orderId) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/v1/orders/${encodeURIComponent(orderId)}`)
        const payload = await response.json()
        if (response.ok && payload?.success && payload?.data) {
          setOrder(payload.data as LastOrder)
        }
      } finally {
        setLoading(false)
      }
    }

    void loadOrder()
  }, [orderId])

  return (
    <MarketingPageShell
      eyebrow="Order placed"
      title="Your order has been placed successfully"
      subtitle="Thank you for shopping with EduMart. Our team will confirm dispatch details shortly."
      accent="green"
      primaryCta={{ label: 'Continue Shopping', href: '/shop' }}
      secondaryCta={{ label: 'View Cart', href: '/cart' }}
    >
      <article className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Confirmation</p>
        <h2 className="mt-2 text-3xl font-extrabold text-slate-900">Order confirmed</h2>

        {loading ? (
          <p className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">Loading order details...</p>
        ) : order ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">Order number</p>
              <p className="mt-2 text-lg font-extrabold text-slate-900">{order.orderNumber}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">Payment</p>
              <p className="mt-2 text-lg font-extrabold text-slate-900">{order.paymentStatus}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">Items</p>
              <p className="mt-2 text-lg font-extrabold text-slate-900">{order.itemCount}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">Total</p>
              <p className="mt-2 text-lg font-extrabold text-slate-900">₹{order.total.toLocaleString('en-IN')}</p>
            </div>
          </div>
        ) : (
          <p className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
            We could not load order details, but your order request has been sent.
          </p>
        )}

        {order?.shippingAddress ? (
          <div className="mt-5 rounded-2xl border border-slate-200 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">Delivery address</p>
            <p className="mt-2 text-sm font-semibold text-slate-900">{order.shippingAddress.fullName}</p>
            <p className="text-sm text-slate-700">{order.shippingAddress.line1}</p>
            <p className="text-sm text-slate-700">{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/shop" className="rounded-xl bg-[#0B3558] px-5 py-3 text-sm font-bold text-white">Shop more</Link>
          <Link href="/" className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700">Back to home</Link>
        </div>
      </article>
    </MarketingPageShell>
  )
}
