"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useMemo, useState } from "react"

import { UserRole } from "@edumart/shared"

import { useMarketplaceState } from "../lib/marketplace-state"
import { getDashboardPathForRole } from "../constants/roles"
import { useWebTheme } from "./web-theme-provider"
import { Heart, Moon, Sun } from "lucide-react"

function CartIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-[2]">
      <path d="M3 4h2l2.2 10.5a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 8H6.2" />
      <circle cx="10" cy="20" r="1.5" />
      <circle cx="17" cy="20" r="1.5" />
    </svg>
  )
}

const NAV_LINKS: Array<{ label: string; href: string }> = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Services", href: "/services" },
  { label: "Doctors", href: "/doctors" },
  { label: "Schools", href: "/schools" },
  { label: "Offers", href: "/offers" },
  { label: "About", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
]

function hasSupabaseSessionCookie() {
  if (typeof document === "undefined") {
    return false
  }

  return document.cookie
    .split(";")
    .some((entry) => /^\s*sb-[^=]+-auth-token(?:\.\d+)?=/.test(entry))
}

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
      if (!hasSupabaseSessionCookie()) {
        if (mounted) {
          setAuthResolved(true)
        }
        return
      }

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
    <header className="sticky top-0 z-40 border-b border-blue-100/40 bg-gradient-to-br from-white/95 via-sky-50/70 to-white/95 backdrop-blur-lg dark:border-slate-700 dark:bg-slate-900/95 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 shadow-lg dark:shadow-none">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6">
        <Link href="/" className="inline-flex items-center gap-3 text-xl font-extrabold tracking-tight sm:text-2xl text-black dark:text-amber-400">
          <img
            src="/brand/karom-edumart-mark.webp"
            alt="Karom EduMart mark"
            className="h-12 w-12 flex-none rounded-2xl border border-blue-200/40 dark:border-slate-700 bg-white/80 dark:bg-slate-800 p-1 object-contain shadow-sm"
          />
          <span className="hidden text-base font-black uppercase tracking-[0.15em] sm:inline text-black dark:text-amber-400">Karom EduMart</span>
        </Link>

        <nav className="ml-auto hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  active ? "bg-blue-600/20 text-black dark:bg-blue-900 dark:text-white" : "text-black/85 hover:bg-white/60 dark:text-slate-200 dark:hover:bg-slate-800"
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
              <span className="hidden rounded-lg border border-blue-200/40 dark:border-slate-600 px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] text-black/80 dark:text-slate-200 sm:inline-flex bg-white/50 dark:bg-transparent">
                {roleLabel}
              </span>
              <Link href={dashboardHref} className="hidden rounded-lg border border-blue-200/40 dark:border-slate-600 px-3 py-2 text-sm font-semibold text-black/85 dark:text-slate-200 dark:hover:bg-slate-800 sm:inline-flex hover:bg-white/60 bg-white/30">
                Dashboard
              </Link>
              <Link href="/logout" className="hidden rounded-lg bg-slate-900 dark:bg-blue-900 px-3 py-2 text-sm font-semibold text-white sm:inline-flex hover:opacity-90">
                Logout
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className="hidden rounded-lg border border-blue-200/40 dark:border-slate-600 px-3 py-2 text-sm font-semibold text-black/85 dark:text-slate-200 sm:inline-flex hover:bg-white/60 dark:hover:bg-slate-800 bg-white/30">
                Login
              </Link>
              <Link href="/signup" className="hidden rounded-lg bg-amber-500 dark:bg-amber-600 px-3 py-2 text-sm font-semibold text-white sm:inline-flex hover:opacity-90">
                Become Seller
              </Link>
            </>
          )}

          <Link
            href="/wishlist"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-blue-200/60 dark:border-slate-600 text-black/85 dark:text-slate-200 transition hover:bg-white/70 dark:hover:bg-slate-800"
            aria-label="Open wishlist"
          >
            <Heart className="h-4 w-4" />
            {wishlistCount > 0 ? (
              <span className="absolute -right-1 -top-1 rounded-full bg-slate-900 dark:bg-blue-900 px-1.5 py-0.5 text-[10px] font-bold text-white">{wishlistCount}</span>
            ) : null}
          </Link>
          <Link
            href="/cart"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-blue-200/60 dark:border-slate-600 text-black/85 dark:text-slate-200 transition hover:bg-white/70 dark:hover:bg-slate-800"
            aria-label="Open cart"
          >
            <CartIcon />
            {cartCount > 0 ? (
              <span className="absolute -right-1 -top-1 rounded-full bg-slate-900 dark:bg-blue-900 px-1.5 py-0.5 text-[10px] font-bold text-white">{cartCount}</span>
            ) : null}
          </Link>
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-blue-200/60 dark:border-slate-600 text-black/85 dark:text-slate-200 transition hover:bg-white/70 dark:hover:bg-slate-800"
            aria-label={`Switch to ${mode === "dark" ? "light" : "dark"} mode`}
          >
            {mode === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            type="button"
            className="rounded-lg border border-blue-200/60 dark:border-slate-600 px-3 py-2 text-sm font-semibold text-black/85 dark:text-slate-200 lg:hidden hover:bg-white/70 dark:hover:bg-slate-800"
            onClick={() => setMobileMenuOpen((value) => !value)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-main-menu"
          >
            Menu
          </button>
        </div>
      </div>

      {mobileMenuOpen ? (
        <div id="mobile-main-menu" className="border-t border-blue-100/40 bg-gradient-to-br from-white/95 via-sky-50/70 to-white/95 dark:border-slate-700 dark:bg-slate-900 px-4 py-3 lg:hidden shadow-lg dark:shadow-none">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                    active ? "bg-blue-600/20 text-black dark:bg-blue-900 dark:text-white" : "bg-white/60 dark:bg-slate-800 text-black/85 dark:text-slate-200"
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
            <Link
              href={isAuthenticated ? dashboardHref : '/login'}
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg border border-blue-200/40 dark:border-slate-600 px-3 py-2 text-sm font-semibold text-black/85 dark:text-slate-200 dark:bg-slate-800 bg-white/30"
            >
              {isAuthenticated ? 'Dashboard' : 'Login'}
            </Link>
            <Link
              href={isAuthenticated ? '/logout' : '/signup'}
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg bg-amber-500 dark:bg-amber-600 px-3 py-2 text-sm font-semibold text-white"
            >
              {isAuthenticated ? 'Logout' : 'Become Seller'}
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  )
}