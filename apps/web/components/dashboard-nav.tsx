'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface DashboardNavProps {
  dashboardPath: string
  dashboardLabel: string
}

export function DashboardNav({ dashboardPath, dashboardLabel }: DashboardNavProps) {
  const pathname = usePathname()

  const dashboardActive = pathname === dashboardPath
  const profileActive = pathname === '/dashboard/profile'

  return (
    <nav className="mt-10 space-y-2 text-sm">
      <Link className={`brand-nav-link ${dashboardActive ? 'brand-nav-link-active' : ''}`} href={dashboardPath}>
        {dashboardLabel} Dashboard
      </Link>
      <Link className={`brand-nav-link ${profileActive ? 'brand-nav-link-active' : ''}`} href="/dashboard/profile">
        Profile
      </Link>
      <Link className="brand-btn-accent mt-3 block px-4 py-3 text-center" href="/logout">
        Sign out
      </Link>
    </nav>
  )
}
