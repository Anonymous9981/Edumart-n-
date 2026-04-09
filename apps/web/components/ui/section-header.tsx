import type { ReactNode } from 'react'

interface SectionHeaderProps {
  title: string
  subtitle?: string
  rightSlot?: ReactNode
}

export function SectionHeader({ title, subtitle, rightSlot }: SectionHeaderProps) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        <h2 className="brand-title inline-flex rounded-lg bg-slate-100 px-3 py-1 text-2xl sm:text-3xl">{title}</h2>
        {subtitle ? <p className="mt-2 text-sm leading-6 text-slate-600">{subtitle}</p> : null}
      </div>
      {rightSlot ? <div>{rightSlot}</div> : null}
    </div>
  )
}
