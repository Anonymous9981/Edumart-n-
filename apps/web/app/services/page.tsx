import Link from 'next/link'

import { MarketingPageShell } from '../../components/marketing-page-shell'

const SERVICE_CARDS = [
  {
    title: 'Doctors Directory',
    description: 'Find child specialists and healthcare listings with contact and maps.',
    href: '/doctors',
    accent: 'from-blue-50 to-indigo-50',
  },
  {
    title: 'Schools Discovery',
    description: 'Browse schools by state, district, block and school flow.',
    href: '/schools',
    accent: 'from-emerald-50 to-cyan-50',
  },
  {
    title: 'Wellness Assessment',
    description: 'School partnership and wellness assessment product flows.',
    href: '/shop?category=assessment-tools',
    accent: 'from-amber-50 to-orange-50',
  },
  {
    title: 'Marketplace',
    description: 'Books, stationery, uniforms, and classroom product catalog.',
    href: '/shop',
    accent: 'from-slate-50 to-slate-100',
  },
]

export default function ServicesPage() {
  return (
    <MarketingPageShell
      eyebrow="Services"
      title="Marketplace services hub"
      subtitle="Explore doctors, schools, wellness, and marketplace discovery from one place."
      accent="teal"
      primaryCta={{ label: 'Browse Shop', href: '/shop' }}
      secondaryCta={{ label: 'View Schools', href: '/schools' }}
    >
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {SERVICE_CARDS.map((service) => (
          <Link
            key={service.title}
            href={service.href}
            className="group rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className={`flex h-36 items-end rounded-2xl bg-gradient-to-br ${service.accent} p-4`}>
              <span className="rounded-full bg-slate-900 px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.22em] text-white">
                Marketplace Flow
              </span>
            </div>
            <h2 className="mt-4 text-xl font-extrabold text-slate-900">{service.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{service.description}</p>
            <p className="mt-4 text-sm font-bold text-[#0B3558] transition group-hover:text-[#00A67E]">Open section -&gt;</p>
          </Link>
        ))}
      </div>
    </MarketingPageShell>
  )
}
