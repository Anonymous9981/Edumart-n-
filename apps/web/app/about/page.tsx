import { MarketingPageShell } from '../../components/marketing-page-shell'

export default function AboutPage() {
  return (
    <MarketingPageShell
      eyebrow="About EduMart"
      title="A trusted marketplace built for students, schools and vendors"
      subtitle="We combine verified supply, school-focused curation, and fast delivery so institutions can buy with confidence."
      accent="navy"
      primaryCta={{ label: 'Order Products', href: '/shop' }}
      secondaryCta={{ label: 'See FAQs', href: '/faq' }}
    >
      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-extrabold text-slate-900">Company Overview</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            EduMart helps families and institutions source books, learning kits, classroom tools and school infrastructure from verified vendors.
            We focus on reliable pricing, automatic discounts, and a checkout experience that is simple enough for parents and robust enough for schools.
          </p>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            Our platform is designed around school purchasing cycles: school selection, class selection, product matching, and fast fulfillment.
          </p>
        </article>

        <aside className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          {[
            ['Products Delivered', '2,40,000+'],
            ['Vendors Associated', '1,800+'],
            ['Schools Served', '950+'],
            ['Avg Delivery Time', '24-48 hrs'],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{label}</p>
              <p className="mt-2 text-3xl font-extrabold text-slate-900">{value}</p>
            </div>
          ))}
        </aside>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="text-xl font-extrabold text-slate-900">How We Work</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              'Verified vendor onboarding',
              'School and class-based catalog mapping',
              'Auto-applied percentage and fixed discounts',
              'Fast dispatch and order tracking',
              'Post-delivery support',
              'School quote support for bulk orders',
            ].map((item) => (
              <div key={item} className="rounded-xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
                {item}
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-700 p-6 text-white shadow-lg">
          <h2 className="text-xl font-extrabold">Trust Badges</h2>
          <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold">
            <span className="rounded-full bg-white/15 px-3 py-1">Verified Vendors</span>
            <span className="rounded-full bg-white/15 px-3 py-1">Fast Delivery</span>
            <span className="rounded-full bg-white/15 px-3 py-1">Secure Checkout</span>
            <span className="rounded-full bg-white/15 px-3 py-1">School Bulk Support</span>
          </div>
          <p className="mt-4 text-sm leading-6 opacity-95">
            Built for institutional trust, transparent prices and reliable fulfillment.
          </p>
        </article>
      </div>

      <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Need to place an order now?</h2>
            <p className="mt-1 text-sm text-slate-600">Use the shop page to start ordering student or school products immediately.</p>
          </div>
          <a href="/shop" className="rounded-xl px-5 py-3 text-sm font-bold text-white" style={{ backgroundColor: '#0B3558' }}>
            Order Products Now
          </a>
        </div>
      </div>
    </MarketingPageShell>
  )
}
