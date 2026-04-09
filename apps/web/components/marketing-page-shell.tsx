"use client"

import Link from 'next/link'
import type { ReactNode } from 'react'

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
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(214,248,236,0.95)_0%,_rgba(248,251,255,1)_40%,_rgba(255,247,237,1)_100%)] text-slate-900">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Link href="/" className="inline-flex items-center gap-3 text-2xl font-extrabold tracking-tight" style={{ color: '#0B3558' }}>
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0B3558] to-[#00A67E] text-base text-white shadow-lg">
                E
              </span>
              <span>EduMart</span>
            </Link>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Education marketplace</p>
          </div>

          <nav className="flex flex-wrap gap-2 text-sm font-semibold text-slate-700">
            {[
              ['Home', '/'],
              ['Shop', '/shop'],
              ['Schools', '/schools'],
              ['Wishlist', '/wishlist'],
              ['Cart', '/cart'],
              ['Offers', '/offers'],
              ['About', '/about'],
              ['FAQ', '/faq'],
              ['Contact', '/contact'],
            ].map(([label, href]) => (
              <Link key={href} href={href} className="rounded-lg px-3 py-2 transition hover:bg-slate-100">
                {label}
              </Link>
            ))}
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

      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6">{children}</section>
    </main>
  )
}
