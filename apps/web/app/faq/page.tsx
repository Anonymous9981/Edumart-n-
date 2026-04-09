'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

import { MarketingPageShell } from '../../components/marketing-page-shell'

const FAQS = [
  {
    q: 'How does automatic discount application work?',
    a: 'Percentage or fixed amount discounts are calculated before checkout and displayed on the product card and page total.',
  },
  {
    q: 'Can schools select a class before viewing products?',
    a: 'Yes. The school flow lets the user choose school first, then class, then the matching catalog appears.',
  },
  {
    q: 'What is included in EduMart Prime?',
    a: 'Prime is a monthly ₹199 membership that includes 4 free deliveries per month and early access to offers.',
  },
  {
    q: 'How does Refer and Earn work?',
    a: 'The referrer gets ₹100 reward and the discount is applicable only on orders above ₹499.',
  },
  {
    q: 'Do you support bulk school purchases?',
    a: 'Yes. Schools can use the contact form or request quotations for infrastructure and bulk learning items.',
  },
]

const FAQ_CATEGORIES = ['All', 'Orders', 'Schools', 'Pricing', 'Membership', 'Support'] as const

function resolveCategory(question: string) {
  const lowerQuestion = question.toLowerCase()

  if (lowerQuestion.includes('school') || lowerQuestion.includes('class')) {
    return 'Schools'
  }

  if (lowerQuestion.includes('prime') || lowerQuestion.includes('membership')) {
    return 'Membership'
  }

  if (lowerQuestion.includes('referral') || lowerQuestion.includes('discount') || lowerQuestion.includes('price')) {
    return 'Pricing'
  }

  if (lowerQuestion.includes('support') || lowerQuestion.includes('contact')) {
    return 'Support'
  }

  return 'Orders'
}

export default function FaqPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<(typeof FAQ_CATEGORIES)[number]>('All')

  const visibleFaqs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return FAQS.filter((item) => {
      const itemCategory = resolveCategory(item.q)
      const matchesCategory = category === 'All' || category === itemCategory
      const matchesQuery = !normalizedQuery || `${item.q} ${item.a}`.toLowerCase().includes(normalizedQuery)

      return matchesCategory && matchesQuery
    })
  }, [category, query])

  return (
    <MarketingPageShell
      eyebrow="FAQ"
      title="Answers to the most common EduMart questions"
      subtitle="Short, practical answers for parents, students, school admins and vendors."
      accent="teal"
      primaryCta={{ label: 'Contact Support', href: '/contact' }}
      secondaryCta={{ label: 'Browse Shop', href: '/shop' }}
    >
      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-slate-500">Search answers</span>
            <input
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-[#00a67e]"
              placeholder="Search by keyword, topic or policy"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>

          <div className="flex flex-wrap gap-2 lg:justify-end">
            {FAQ_CATEGORIES.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${category === item ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-3 text-sm text-slate-500">
          Showing {visibleFaqs.length} of {FAQS.length} answers.
        </p>
      </div>

      <div className="mt-5 space-y-3">
        {visibleFaqs.length ? (
          visibleFaqs.map((item) => (
            <details key={item.q} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <summary className="cursor-pointer text-base font-extrabold text-slate-900">{item.q}</summary>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.a}</p>
            </details>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
            No matches found. Try another keyword or switch to a different category.
          </div>
        )}
      </div>

      <div className="mt-6 rounded-3xl bg-slate-900 p-6 text-white shadow-lg">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-extrabold">Need more help?</h2>
            <p className="mt-2 text-sm leading-6 opacity-90">Go to the contact page or continue browsing products and offers.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/contact" className="rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-900">
              Contact Us
            </Link>
            <Link href="/shop" className="rounded-xl border border-white/20 px-5 py-3 text-sm font-bold text-white">
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    </MarketingPageShell>
  )
}
