import Link from 'next/link';

import { MarketingPageShell } from '../../components/marketing-page-shell';

export const dynamic = 'force-dynamic'

function normalizeReturnPath(value: string | undefined) {
  if (!value || !value.startsWith('/') || value.startsWith('//')) {
    return '/dashboard'
  }

  return value
}

function normalizeRequestedPage(value: string) {
  let current = value

  for (let depth = 0; depth < 5; depth += 1) {
    if (!current.startsWith('/login?from=')) {
      break
    }

    const encoded = current.slice('/login?from='.length)

    try {
      const decoded = decodeURIComponent(encoded)
      if (!decoded || decoded === current) {
        break
      }

      current = decoded
    } catch {
      break
    }
  }

  return current
}

export default async function UnauthorizedPage({ searchParams }: { searchParams?: Promise<{ from?: string }> }) {
  const params = await searchParams
  const returnPath = normalizeReturnPath(params?.from)
  const requestedPage = normalizeRequestedPage(returnPath)
  const loginHref = `/login?from=${encodeURIComponent(returnPath)}`
  const signupHref = `/signup?from=${encodeURIComponent(returnPath)}`

  return (
    <MarketingPageShell
      eyebrow="Access Control"
      title="You need the right account to continue"
      subtitle="This area is role-protected. Sign in with an account that has access, and we will send you back to the page you tried to open."
      accent="navy"
      primaryCta={{ label: 'Open Marketplace', href: '/' }}
      secondaryCta={{ label: 'Back to Dashboard', href: '/dashboard' }}
    >
      <div className="mx-auto max-w-3xl">
        <div className="brand-card rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">403 Unauthorized</p>
          <h2 className="mt-3 text-3xl font-extrabold text-slate-900">Access denied</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Your current session does not have permission for this route. Sign in with the correct role and we will return you to the same page.
          </p>

          <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Requested page</p>
            <p className="mt-2 break-all text-sm font-semibold text-slate-800">{requestedPage}</p>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Link
              className="inline-flex items-center justify-center rounded-xl bg-[#0B3558] px-4 py-3 text-sm font-bold text-white"
              href={loginHref}
            >
              Sign in and continue
            </Link>
            <Link
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-4 py-3 text-sm font-bold text-slate-700"
              href={returnPath}
            >
              Retry this page
            </Link>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Sign-in window</p>
            <p className="mt-2 text-sm text-slate-600">
              Continue to login to unlock this route. If you do not have an account, create one and then continue back to this page.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Link
                className="inline-flex items-center justify-center rounded-xl bg-[#0B3558] px-4 py-3 text-sm font-bold text-white"
                href={loginHref}
              >
                Open sign in
              </Link>
              <Link
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-4 py-3 text-sm font-bold text-slate-700"
                href={signupHref}
              >
                Create account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MarketingPageShell>
  );
}
