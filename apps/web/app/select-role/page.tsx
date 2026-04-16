'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

import { UserRole } from '@edumart/shared'

import { getDashboardPath } from '../../lib/auth'

function normalizeReturnPath(value: string | null) {
  if (!value || !value.startsWith('/') || value.startsWith('//')) {
    return '/dashboard/customer'
  }

  return value
}

export default function SelectRolePage() {
  const router = useRouter()
  const [role, setRole] = useState<UserRole>(UserRole.CUSTOMER)
  const [storeName, setStoreName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [returnTo, setReturnTo] = useState('/dashboard/customer')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setReturnTo(normalizeReturnPath(params.get('returnTo')))
  }, [])

  const requiresStoreName = role === UserRole.VENDOR
  const submitLabel = useMemo(() => (loading ? 'Saving...' : 'Continue'), [loading])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    if (requiresStoreName && !storeName.trim()) {
      setError('Store name is required for vendor role')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/v1/auth/select-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, storeName: storeName.trim() || null }),
      })

      const payload = (await response.json()) as { success?: boolean; error?: { message?: string } }
      if (!response.ok || !payload.success) {
        throw new Error(payload.error?.message || 'Unable to save role')
      }

      const defaultPath = getDashboardPath(role)
      router.push(returnTo !== '/dashboard/customer' ? returnTo : defaultPath)
      router.refresh()
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to save role')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="brand-page">
      <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-6 py-10">
        <form onSubmit={handleSubmit} className="brand-panel w-full space-y-6 p-8 text-slate-900">
          <div>
            <p className="brand-kicker">First-time sign in</p>
            <h1 className="brand-title mt-2 text-3xl">Choose your role</h1>
            <p className="mt-2 text-sm text-slate-600">
              Select how you want to use EduMart. You can continue as a customer or create a vendor workspace.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setRole(UserRole.CUSTOMER)}
              className={`rounded-2xl border px-4 py-4 text-left transition ${role === UserRole.CUSTOMER ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-300 bg-white text-slate-800'}`}
            >
              <p className="text-sm font-bold uppercase tracking-[0.12em]">Customer</p>
              <p className="mt-1 text-sm opacity-90">Shop, wishlist, cart, and orders</p>
            </button>
            <button
              type="button"
              onClick={() => setRole(UserRole.VENDOR)}
              className={`rounded-2xl border px-4 py-4 text-left transition ${role === UserRole.VENDOR ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-300 bg-white text-slate-800'}`}
            >
              <p className="text-sm font-bold uppercase tracking-[0.12em]">Vendor</p>
              <p className="mt-1 text-sm opacity-90">Manage products and storefront</p>
            </button>
          </div>

          {requiresStoreName ? (
            <label className="block text-sm font-semibold text-slate-700">
              Store name
              <input
                className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2"
                value={storeName}
                onChange={(event) => setStoreName(event.target.value)}
                placeholder="Your store name"
              />
            </label>
          ) : null}

          {error ? <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="brand-btn-primary inline-flex w-full items-center justify-center rounded-xl px-4 py-3 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitLabel}
          </button>
        </form>
      </div>
    </main>
  )
}
