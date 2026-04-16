"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useMemo, useState } from "react"

import { UserRole } from "@edumart/shared"

import { useMarketplaceState } from "../lib/marketplace-state"
import { getDashboardPathForRole } from "../constants/roles"
import { useWebTheme } from "./web-theme-provider"

function CartIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-[2]">
      <path d="M3 4h2l2.2 10.5a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 8H6.2" />
      <circle cx="10" cy="20" r="1.5" />
      <circle cx="17" cy="20" r="1.5" />
    </svg>
  )
}

function HeartIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-[2]">
      <path d="M12 21s-7-4.8-9.2-9.4C1 8.2 2.7 5.5 5.8 5.1c1.7-.2 3.4.6 4.2 1.9.8-1.3 2.5-2.1 4.2-1.9 3.1.4 4.8 3.1 3 6.5C19 16.2 12 21 12 21Z" />
    </svg>
  )
}

const NAV_LINKS: Array<{ label: string; href: string }> = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Services", href: "/services" },
  { label: "Schools", href: "/schools" },
  { label: "Offers", href: "/offers" },
  { label: "About", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
]

export function AppHeader() {
  const marketplace = useMarketplaceState()
  const { mode, toggleTheme } = useWebTheme()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [role, setRole] = useState<UserRole | null>(null)
  const [authResolved, setAuthResolved] = useState(false)

  const cartCount = useMemo(() => Object.values(marketplace.cart).reduce((sum, qty) => sum + qty, 0), [marketplace.cart])
  const wishlistCount = marketplace.wishlist.length
  const isAuthenticated = role !== null
  const roleLabel = role ? role[0] + role.slice(1).toLowerCase() : ""
  const dashboardHref = role ? getDashboardPathForRole(role) : "/dashboard"

  useEffect(() => {
    let mounted = true

    async function loadAuthState() {
      try {
        const response = await fetch('/api/v1/auth/me', { cache: 'no-store' })
        const payload = (await response.json()) as { success?: boolean; data?: { user?: { role?: string } } }

        if (!mounted) {
          return
        }

        if (payload.success && payload.data?.user?.role) {
          const normalized = payload.data.user.role.toUpperCase()
          if (normalized === UserRole.CUSTOMER || normalized === UserRole.VENDOR || normalized === UserRole.ADMIN) {
            setRole(normalized as UserRole)
          }
        }
      } catch {
        // Keep guest header when auth check fails.
      } finally {
        if (mounted) {
          setAuthResolved(true)
        }
      }
    }

    loadAuthState()

    return () => {
      mounted = false
    }
  }, [])

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6">
        <Link href="/" className="inline-flex items-center gap-3 text-xl font-extrabold tracking-tight sm:text-2xl" style={{ color: "#0B3558" }}>
          <img
            src="/brand/karom-edumart-mark.webp"
            alt="Karom EduMart mark"
            className="h-12 w-12 flex-none rounded-2xl border border-amber-200 bg-white p-1 object-contain shadow"
          />
          <span className="hidden text-base font-black uppercase tracking-[0.15em] text-[#0B3558] sm:inline">Karom EduMart</span>
        </Link>

        <nav className="ml-auto hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  active ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-3">
          {authResolved && isAuthenticated ? (
            <>
              <span className="hidden rounded-lg border border-slate-300 px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-700 sm:inline-flex">
                {roleLabel}
              </span>
              <Link href={dashboardHref} className="hidden rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 sm:inline-flex">
                Dashboard
              </Link>
              <Link href="/logout" className="hidden rounded-lg bg-[#0B3558] px-3 py-2 text-sm font-semibold text-white sm:inline-flex">
                Logout
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className="hidden rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 sm:inline-flex">
                Login
              </Link>
              <Link href="/signup" className="hidden rounded-lg bg-[#B78A2A] px-3 py-2 text-sm font-semibold text-white sm:inline-flex">
                Become Seller
              </Link>
            </>
          )}

          <Link
            href="/wishlist"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-300 text-slate-700 transition hover:bg-slate-100"
            aria-label="Open wishlist"
          >
            <HeartIcon />
            {wishlistCount > 0 ? (
              <span className="absolute -right-1 -top-1 rounded-full bg-slate-900 px-1.5 py-0.5 text-[10px] font-bold text-white">{wishlistCount}</span>
            ) : null}
          </Link>
          <Link
            href="/cart"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-300 text-slate-700 transition hover:bg-slate-100"
            aria-label="Open cart"
          >
            <CartIcon />
            {cartCount > 0 ? (
              <span className="absolute -right-1 -top-1 rounded-full bg-[#0B3558] px-1.5 py-0.5 text-[10px] font-bold text-white">{cartCount}</span>
            ) : null}
          </Link>
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-300 px-3 text-xs font-bold uppercase tracking-[0.14em] text-slate-700 transition hover:bg-slate-100"
            aria-label={`Switch to ${mode === "dark" ? "light" : "dark"} mode`}
          >
            {mode === "dark" ? "Light" : "Dark"}
          </button>
          <button
            type="button"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold lg:hidden"
            onClick={() => setMobileMenuOpen((value) => !value)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-main-menu"
          >
            Menu
          </button>
        </div>
      </div>

      {mobileMenuOpen ? (
        <div id="mobile-main-menu" className="border-t border-slate-200 bg-white px-4 py-3 lg:hidden">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                    active ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
            <Link
              href={isAuthenticated ? dashboardHref : '/login'}
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700"
            >
              {isAuthenticated ? 'Dashboard' : 'Login'}
            </Link>
            <Link
              href={isAuthenticated ? '/logout' : '/signup'}
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg bg-[#B78A2A] px-3 py-2 text-sm font-semibold text-white"
            >
              {isAuthenticated ? 'Logout' : 'Become Seller'}
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  )
}