import Link from 'next/link'

import { MarketingPageShell } from '../../components/marketing-page-shell'

export const dynamic = 'force-dynamic'

function normalizeReturnPath(value: string | undefined) {
  if (!value || !value.startsWith('/') || value.startsWith('//')) {
    return '/dashboard/profile'
  }

  return value
}

export default async function AccountInactivePage({
  searchParams,
}: {
  searchParams?: Promise<{ from?: string }>
}) {
  const resolvedSearchParams = await searchParams
  const returnPath = normalizeReturnPath(resolvedSearchParams?.from)
  const loginHref = `/login?from=${encodeURIComponent(returnPath)}`

  return (
    <MarketingPageShell
      eyebrow="Account Status"
      title="Your account is not active yet"
      subtitle="This account is signed in, but it cannot access protected dashboard areas until status becomes active."
      accent="amber"
      primaryCta={{ label: 'Open Marketplace', href: '/' }}
      secondaryCta={{ label: 'Back to Profile', href: '/dashboard/profile' }}
    >
      <div className="mx-auto max-w-3xl">
        <div className="brand-card rounded-[2rem] border border-amber-200 bg-white p-6 shadow-xl sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-amber-700">Account Inactive</p>
          <h2 className="mt-3 text-3xl font-extrabold text-slate-900">Access is temporarily limited</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Your profile exists, but account status is not active yet. Contact support if this should already be enabled.
          </p>

          <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Attempted page</p>
            <p className="mt-2 break-all text-sm font-semibold text-slate-800">{returnPath}</p>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Link
              className="inline-flex items-center justify-center rounded-xl bg-[#0B3558] px-4 py-3 text-sm font-bold text-white"
              href="/dashboard/profile"
            >
              Open profile
            </Link>
            <Link
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-4 py-3 text-sm font-bold text-slate-700"
              href={loginHref}
            >
              Sign in again
            </Link>
          </div>
        </div>
      </div>
    </MarketingPageShell>
  )
}
