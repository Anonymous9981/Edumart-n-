"use client"

import Link from 'next/link'
import type { ReactNode } from 'react'

import { useMarketplaceState } from '../lib/marketplace-state'

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

function HomeIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-[2]">
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5.5 9.5V21h13V9.5" />
    </svg>
  )
}

function ShopIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-[2]">
      <path d="M4 8h16l-1.2 11a2 2 0 0 1-2 1.8H7.2a2 2 0 0 1-2-1.8L4 8Z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  )
}

interface MarketingPageShellProps {
  eyebrow: string
  title: string
  subtitle: string
  accent: 'navy' | 'teal' | 'amber' | 'green' | 'blue'
  primaryCta: { label: string; href: string }
  secondaryCta?: { label: string; href: string }
  children: ReactNode
}

const ACCENT_STYLES = {
  navy: 'from-[#0B3558] to-[#14507E]',
  teal: 'from-[#0B3558] to-[#00A67E]',
  amber: 'from-[#7C2D12] to-[#FF8A24]',
  green: 'from-[#0F766E] to-[#10B981]',
  blue: 'from-[#1D4ED8] to-[#2563EB]',
}

export function MarketingPageShell({
  eyebrow,
  title,
  subtitle,
  accent,
  primaryCta,
  secondaryCta,
  children,
}: MarketingPageShellProps) {
  const marketplace = useMarketplaceState()
  const cartCount = Object.values(marketplace.cart).reduce((total, quantity) => total + quantity, 0)
  const wishlistCount = marketplace.wishlist.length

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(214,248,236,0.95)_0%,_rgba(248,251,255,1)_40%,_rgba(255,247,237,1)_100%)] text-slate-900">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Link href="/" className="inline-flex items-center gap-3 text-2xl font-extrabold tracking-tight" style={{ color: '#0B3558' }}>
              <img
                src="/brand/karom-edumart-logo.svg"
                alt="Karom EduMart"
                className="h-11 w-[180px] flex-none rounded-xl border border-amber-200 bg-white object-contain px-2 py-1 shadow-lg"
              />
            </Link>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Education marketplace</p>
          </div>

          <nav className="hidden flex-wrap gap-2 text-sm font-semibold text-slate-700 sm:flex">
            {[
              ['Home', '/'],
              ['Shop', '/shop'],
              ['Schools', '/schools'],
              ['Offers', '/offers'],
              ['About', '/about'],
              ['FAQ', '/faq'],
              ['Contact', '/contact'],
            ].map(([label, href]) => (
              <Link key={href} href={href} className="rounded-lg px-3 py-2 transition hover:bg-slate-100">
                {label}
              </Link>
            ))}
            <Link href="/wishlist" className="inline-flex items-center gap-2 rounded-lg px-3 py-2 transition hover:bg-slate-100" aria-label="Open wishlist">
              <HeartIcon />
              <span>Wishlist</span>
              <span className="rounded-full bg-slate-900 px-2 py-0.5 text-xs font-bold text-white">{wishlistCount}</span>
            </Link>
            <Link href="/cart" className="inline-flex items-center gap-2 rounded-lg px-3 py-2 transition hover:bg-slate-100" aria-label="Open cart">
              <CartIcon />
              <span>Cart</span>
              <span className="rounded-full bg-[#0B3558] px-2 py-0.5 text-xs font-bold text-white">{cartCount}</span>
            </Link>
          </nav>

          <nav className="flex items-center justify-end gap-2 sm:hidden">
            <Link href="/" className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-300 text-slate-700 transition hover:bg-slate-100" aria-label="Home">
              <HomeIcon />
            </Link>
            <Link href="/shop" className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-300 text-slate-700 transition hover:bg-slate-100" aria-label="Shop">
              <ShopIcon />
            </Link>
            <Link href="/wishlist" className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-300 text-slate-700 transition hover:bg-slate-100" aria-label="Open wishlist">
              <HeartIcon />
              {wishlistCount > 0 ? (
                <span className="absolute -right-1 -top-1 rounded-full bg-slate-900 px-1.5 py-0.5 text-[10px] font-bold text-white">{wishlistCount}</span>
              ) : null}
            </Link>
            <Link href="/cart" className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-300 text-slate-700 transition hover:bg-slate-100" aria-label="Open cart">
              <CartIcon />
              {cartCount > 0 ? (
                <span className="absolute -right-1 -top-1 rounded-full bg-[#0B3558] px-1.5 py-0.5 text-[10px] font-bold text-white">{cartCount}</span>
              ) : null}
            </Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 pb-8 pt-6 sm:px-6 lg:pt-10">
        <div className={`overflow-hidden rounded-[2rem] bg-gradient-to-br ${ACCENT_STYLES[accent]} p-6 text-white shadow-2xl sm:p-8`}>
          <p className="text-xs font-bold uppercase tracking-[0.3em] opacity-90">{eyebrow}</p>
          <div className="mt-3 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">{title}</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 opacity-95 sm:text-base">{subtitle}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href={primaryCta.href} className="rounded-xl bg-white px-5 py-3 text-sm font-bold" style={{ color: '#0B3558' }}>
                {primaryCta.label}
              </Link>
              {secondaryCta ? (
                <Link href={secondaryCta.href} className="rounded-xl border border-white/40 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10">
                  {secondaryCta.label}
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6">
        {children}
      </section>
    </main>
  )
}
