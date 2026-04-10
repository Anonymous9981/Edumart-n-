import { MarketingPageShell } from '../../../components/marketing-page-shell'

export default function PrimeMembershipPage() {
  return (
    <MarketingPageShell
      eyebrow="Prime Membership"
      title="EduMart Prime for families and institutions"
      subtitle="A predictable monthly plan for shipping, priority support, and members-only savings."
      accent="blue"
      primaryCta={{ label: 'Activate Prime', href: '/checkout' }}
      secondaryCta={{ label: 'Back to Offers', href: '/offers' }}
    >
      <div className="grid gap-5 lg:grid-cols-3">
        {[
          ['4 free deliveries', 'Get up to 4 free deliveries every month for all eligible orders.'],
          ['Early access deals', 'Members get first access to campaigns and launch bundles.'],
          ['Priority support', 'Fast support queue for order and delivery assistance.'],
        ].map(([title, description]) => (
          <article key={title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-extrabold text-slate-900">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
          </article>
        ))}
      </div>
    </MarketingPageShell>
  )
}
