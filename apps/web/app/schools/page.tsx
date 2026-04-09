'use client'

import { useState } from 'react'

import { MarketingPageShell } from '../../components/marketing-page-shell'

const SCHOOLS = ['Sunrise Public School', 'Green Valley School', 'Scholars Academy', 'Vidya Global School']
const CLASSES = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']

export default function SchoolsPage() {
  const [school, setSchool] = useState('')
  const [className, setClassName] = useState('')

  const ready = school && className

  const schoolOfferings = [
    ['Classroom Tech', 'Interactive panels, hybrid teaching tools and digital boards'],
    ['School Infrastructure', 'Furniture, lab tools and safety equipment'],
    ['Student Essentials', 'Class matching books and stationery packs'],
    ['Event Solutions', 'Plantorium and school experience programs'],
    ['Library & Reading', 'Reading corners, cataloging and book shelving'],
    ['Lab Equipment', 'Science, biology and practical learning kits'],
    ['Sports & PE', 'Equipment for fitness, games and annual sports days'],
    ['Uniforms', 'Uniform bundles, house wear and accessory packs'],
    ['Attendance Tools', 'Tablet-based attendance and reporting setup'],
    ['School Software', 'Parent communication and admin coordination tools'],
  ]

  return (
    <MarketingPageShell
      eyebrow="School Flow"
      title="Select school, then class, then see matched products"
      subtitle="A school-first buying flow for class-wise product discovery and bulk order planning."
      accent="green"
      primaryCta={{ label: 'Browse Shop', href: '/shop' }}
      secondaryCta={{ label: 'Contact Team', href: '/contact' }}
    >
      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-extrabold text-slate-900">School selection</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">Choose your institution and class to see relevant products and learning kits.</p>

          <div className="mt-4 grid gap-3">
            <select className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none" value={school} onChange={(event) => setSchool(event.target.value)}>
              <option value="">Select school</option>
              {SCHOOLS.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>

            <select className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none" value={className} onChange={(event) => setClassName(event.target.value)} disabled={!school}>
              <option value="">Select class</option>
              {CLASSES.map((item) => (
                <option key={item} value={item}>Class {item}</option>
              ))}
            </select>
          </div>

          <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
            {ready ? `Showing products for ${school} - Class ${className}` : 'Select both school and class to continue.'}
          </div>
        </article>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {schoolOfferings.map(([title, description]) => (
            <article key={title} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex h-32 items-end rounded-2xl bg-gradient-to-br from-emerald-50 via-white to-cyan-50 p-4">
                <span className="rounded-full bg-slate-900 px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-white">
                  School Pack
                </span>
              </div>
              <h3 className="mt-4 text-lg font-extrabold text-slate-900">{title}</h3>
              <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
              <button className="mt-4 rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50">
                View details
              </button>
            </article>
          ))}
        </div>
      </div>
    </MarketingPageShell>
  )
}
