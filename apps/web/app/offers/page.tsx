import { MarketingPageShell } from '../../components/marketing-page-shell'
import Link from 'next/link'

export default function OffersPage() {
  return (
    <MarketingPageShell
      eyebrow="Offers"
      title="Prime membership, referrals and auto-applied discounts"
      subtitle="A clear view of promotions so customers can understand what they save and when the offer applies."
      accent="navy"
      primaryCta={{ label: 'Join Prime', href: '/contact' }}
      secondaryCta={{ label: 'Shop Now', href: '/shop' }}
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <article className="rounded-3xl bg-gradient-to-br from-violet-600 to-purple-700 p-6 text-white shadow-lg">
          <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-90">Prime Membership</p>
          <h2 className="mt-2 text-3xl font-extrabold">₹199 / month</h2>
          <p className="mt-2 text-sm leading-6 opacity-95">Users get 4 free deliveries every month plus early access to sale offers.</p>
          <Link href="/offers/prime" className="mt-4 inline-flex rounded-lg bg-white px-4 py-2 text-sm font-bold text-violet-700">View Prime details</Link>
        </article>

        <article className="rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-700 p-6 text-white shadow-lg">
          <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-90">Refer & Earn</p>
          <h2 className="mt-2 text-3xl font-extrabold">₹100 reward</h2>
          <p className="mt-2 text-sm leading-6 opacity-95">Referral discount is usable only above ₹499 order value.</p>
          <Link href="/offers/refer" className="mt-4 inline-flex rounded-lg bg-white px-4 py-2 text-sm font-bold text-emerald-700">View referral details</Link>
        </article>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        {[
          ['Percentage discount', 'Automatic percentage reduction with original price shown.'],
          ['Fixed amount discount', 'Flat rupee amount reduction applied directly to the final price.'],
          ['Auto application', 'Discounts are calculated in the product card and preserved at checkout.'],
        ].map(([title, description]) => (
          <article key={title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-extrabold text-slate-900">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
          </article>
        ))}
      </div>
    </MarketingPageShell>
  )
}
