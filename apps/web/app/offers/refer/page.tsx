import { MarketingPageShell } from '../../../components/marketing-page-shell'

export default function ReferEarnPage() {
  return (
    <MarketingPageShell
      eyebrow="Refer to Earn"
      title="Earn rewards with every successful referral"
      subtitle="Invite friends, parents, and school admins to EduMart and earn wallet rewards."
      accent="green"
      primaryCta={{ label: 'Start Referring', href: '/signup' }}
      secondaryCta={{ label: 'Back to Offers', href: '/offers' }}
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-extrabold text-slate-900">How it works</h3>
          <ol className="mt-4 space-y-3 text-sm text-slate-700">
            <li>1. Share your referral code.</li>
            <li>2. Friend places first valid order above ₹499.</li>
            <li>3. You receive ₹100 reward credit automatically.</li>
          </ol>
        </article>
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-extrabold text-slate-900">Program rules</h3>
          <ul className="mt-4 space-y-2 text-sm text-slate-700">
            <li>• Minimum referred order value: ₹499</li>
            <li>• Reward issued after successful order completion</li>
            <li>• Referral rewards are non-transferable</li>
          </ul>
        </article>
      </div>
    </MarketingPageShell>
  )
}
