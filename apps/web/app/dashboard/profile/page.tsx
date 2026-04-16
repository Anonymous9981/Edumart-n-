'use client'

import { useEffect, useMemo, useState } from 'react'

type Role = 'CUSTOMER' | 'VENDOR' | 'ADMIN'

type ProfilePayload = {
  user?: {
    role?: Role
    email?: string
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    bio?: string | null
    avatar?: string | null
    vendorProfile?: {
      storeName?: string | null
      description?: string | null
      logo?: string | null
      banner?: string | null
      taxId?: string | null
      bankAccountName?: string | null
      bankAccountNumber?: string | null
      bankCode?: string | null
    } | null
  }
}

type ProfileFormState = {
  firstName: string
  lastName: string
  phone: string
  bio: string
  avatar: string
  storeName: string
  description: string
  logo: string
  banner: string
  taxId: string
  bankAccountName: string
  bankAccountNumber: string
  bankCode: string
}

const EMPTY_STATE: ProfileFormState = {
  firstName: '',
  lastName: '',
  phone: '',
  bio: '',
  avatar: '',
  storeName: '',
  description: '',
  logo: '',
  banner: '',
  taxId: '',
  bankAccountName: '',
  bankAccountNumber: '',
  bankCode: '',
}

export default function DashboardProfilePage() {
  const [form, setForm] = useState<ProfileFormState>(EMPTY_STATE)
  const [role, setRole] = useState<Role | null>(null)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState('')

  useEffect(() => {
    let mounted = true

    async function loadProfile() {
      try {
        const response = await fetch('/api/v1/profile', { cache: 'no-store' })
        const payload = (await response.json()) as { success?: boolean; data?: ProfilePayload; error?: { message?: string } }

        if (!mounted) {
          return
        }

        if (!payload.success || !payload.data?.user) {
          setNotice(payload.error?.message || 'Unable to load profile')
          return
        }

        const user = payload.data.user
        setRole((user.role as Role | undefined) ?? null)
        setEmail(user.email ?? '')
        setForm({
          firstName: user.firstName ?? '',
          lastName: user.lastName ?? '',
          phone: user.phone ?? '',
          bio: user.bio ?? '',
          avatar: user.avatar ?? '',
          storeName: user.vendorProfile?.storeName ?? '',
          description: user.vendorProfile?.description ?? '',
          logo: user.vendorProfile?.logo ?? '',
          banner: user.vendorProfile?.banner ?? '',
          taxId: user.vendorProfile?.taxId ?? '',
          bankAccountName: user.vendorProfile?.bankAccountName ?? '',
          bankAccountNumber: user.vendorProfile?.bankAccountNumber ?? '',
          bankCode: user.vendorProfile?.bankCode ?? '',
        })
      } catch {
        if (mounted) {
          setNotice('Unable to load profile')
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadProfile()

    return () => {
      mounted = false
    }
  }, [])

  const isVendor = role === 'VENDOR'
  const roleLabel = useMemo(() => {
    if (role === 'ADMIN') return 'Admin'
    if (role === 'VENDOR') return 'Vendor'
    if (role === 'CUSTOMER') return 'Customer'
    return 'User'
  }, [role])

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setNotice('')

    try {
      const response = await fetch('/api/v1/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const payload = (await response.json()) as { success?: boolean; error?: { message?: string } }

      if (!payload.success) {
        setNotice(payload.error?.message || 'Unable to save profile')
        return
      }

      setNotice('Profile updated successfully.')
    } catch {
      setNotice('Unable to save profile')
    } finally {
      setSaving(false)
    }
  }

  function update<K extends keyof ProfileFormState>(key: K, value: ProfileFormState[K]) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  return (
    <section className="space-y-6">
      <div>
        <h2 className="brand-title text-3xl tracking-tight">Profile</h2>
        <p className="mt-2 text-sm text-slate-600">
          Manage your {roleLabel.toLowerCase()} profile details. Changes are saved to your live account.
        </p>
      </div>

      {loading ? (
        <div className="brand-card p-6 text-sm text-slate-600">Loading profile...</div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="brand-card p-6">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">Account</p>
            <p className="mt-2 text-sm text-slate-700">{email || 'Signed in user'}</p>
            <p className="mt-1 text-sm text-slate-600">Role: {roleLabel}</p>
          </div>

          <div className="brand-card grid gap-4 p-6 md:grid-cols-2">
            <label className="text-sm font-semibold text-slate-700">
              First name
              <input className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2" value={form.firstName} onChange={(event) => update('firstName', event.target.value)} />
            </label>
            <label className="text-sm font-semibold text-slate-700">
              Last name
              <input className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2" value={form.lastName} onChange={(event) => update('lastName', event.target.value)} />
            </label>
            <label className="text-sm font-semibold text-slate-700">
              Phone
              <input className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2" value={form.phone} onChange={(event) => update('phone', event.target.value)} />
            </label>
            <label className="text-sm font-semibold text-slate-700">
              Avatar URL
              <input className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2" value={form.avatar} onChange={(event) => update('avatar', event.target.value)} />
            </label>
            <label className="text-sm font-semibold text-slate-700 md:col-span-2">
              Bio
              <textarea className="mt-2 min-h-24 w-full rounded-xl border border-slate-300 px-3 py-2" value={form.bio} onChange={(event) => update('bio', event.target.value)} />
            </label>
          </div>

          {isVendor ? (
            <div className="brand-card grid gap-4 p-6 md:grid-cols-2">
              <label className="text-sm font-semibold text-slate-700">
                Store name
                <input className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2" value={form.storeName} onChange={(event) => update('storeName', event.target.value)} />
              </label>
              <label className="text-sm font-semibold text-slate-700">
                GST / Tax ID
                <input className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2" value={form.taxId} onChange={(event) => update('taxId', event.target.value)} />
              </label>
              <label className="text-sm font-semibold text-slate-700 md:col-span-2">
                Store description
                <textarea className="mt-2 min-h-24 w-full rounded-xl border border-slate-300 px-3 py-2" value={form.description} onChange={(event) => update('description', event.target.value)} />
              </label>
              <label className="text-sm font-semibold text-slate-700">
                Logo URL
                <input className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2" value={form.logo} onChange={(event) => update('logo', event.target.value)} />
              </label>
              <label className="text-sm font-semibold text-slate-700">
                Banner URL
                <input className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2" value={form.banner} onChange={(event) => update('banner', event.target.value)} />
              </label>
              <label className="text-sm font-semibold text-slate-700">
                Bank account name
                <input className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2" value={form.bankAccountName} onChange={(event) => update('bankAccountName', event.target.value)} />
              </label>
              <label className="text-sm font-semibold text-slate-700">
                Bank account number
                <input className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2" value={form.bankAccountNumber} onChange={(event) => update('bankAccountNumber', event.target.value)} />
              </label>
              <label className="text-sm font-semibold text-slate-700">
                Bank code
                <input className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2" value={form.bankCode} onChange={(event) => update('bankCode', event.target.value)} />
              </label>
            </div>
          ) : null}

          {notice ? (
            <p className="text-sm font-semibold text-slate-700">{notice}</p>
          ) : null}

          <button
            type="submit"
            disabled={saving}
            className="brand-btn-accent rounded-xl px-5 py-3 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-70"
          >
            {saving ? 'Saving...' : 'Save profile'}
          </button>
        </form>
      )}
    </section>
  )
}
