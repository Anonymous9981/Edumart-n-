import type { HomepageAudience } from '../../lib/homepage-types'

interface HeroCardProps {
  audience: HomepageAudience
  title: string
  subtitle: string
  image: string
  buttonLabel: string
}

export function HeroCard({ audience, title, subtitle, image, buttonLabel }: HeroCardProps) {
  return (
    <article
      className={`brand-hover-lift overflow-hidden rounded-3xl border text-white shadow-lg transition-all duration-300 ${
        audience === 'student'
          ? 'border-[#0b3558]/20 bg-gradient-to-br from-[#0B3558] via-[#14507E] to-[#00A67E]'
          : 'border-[#ff8a24]/20 bg-gradient-to-br from-[#5A2E0A] via-[#A54A10] to-[#FF8A24]'
      }`}
    >
      <div className="grid gap-3 p-6 sm:grid-cols-[1.2fr_0.8fr] sm:items-center">
        <div>
          <p
            className={`text-xs font-bold uppercase tracking-[0.2em] ${
              audience === 'student' ? 'text-teal-100' : 'text-amber-100'
            }`}
          >
            {audience === 'student' ? 'Student Products' : 'Teacher Products'}
          </p>
          <h1 className="mt-2 text-3xl font-extrabold leading-tight sm:text-4xl">{title}</h1>
          <p className="mt-2 text-sm opacity-95 sm:text-base">{subtitle}</p>
          <button className="mt-4 rounded-xl bg-white px-5 py-2 text-sm font-bold text-[#0B3558] transition hover:scale-[1.03]">
            {buttonLabel}
          </button>
        </div>
        <div className="rounded-2xl bg-white/15 p-3">
          <img src={image} alt={title} className="h-44 w-full rounded-xl object-contain sm:h-52" />
        </div>
      </div>
    </article>
  )
}
