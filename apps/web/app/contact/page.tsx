"use client"

import { MarketingPageShell } from '../../components/marketing-page-shell'
import { useSiteFeedback } from '../../lib/site-feedback'

export default function ContactPage() {
  const feedback = useSiteFeedback()

  return (
    <MarketingPageShell
      eyebrow="Contact EduMart"
      title="Talk to our team for orders, quotations and support"
      subtitle="Use the form below for product help, school procurement, bulk orders or partnership requests."
      accent="blue"
      primaryCta={{ label: 'Browse Shop', href: '/shop' }}
      secondaryCta={{ label: 'View FAQ', href: '/faq' }}
    >
      <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div className="bg-gradient-to-br from-[#0B3558] via-[#14507E] to-[#00A67E] p-6 text-white sm:p-7">
            <p className="text-xs font-bold uppercase tracking-[0.28em] opacity-90">Support desk</p>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight">Everything you need to contact EduMart in one place.</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/90">
              For school procurement, bulk classroom supply, product questions or partnership requests, our team replies with clear next steps.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                ['Fast reply', 'Within 1 business day'],
                ['Support hours', 'Mon - Sat, 9 AM - 7 PM'],
                ['Best for', 'Schools, parents and vendors'],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                  <p className="text-[0.7rem] font-bold uppercase tracking-[0.22em] text-white/75">{label}</p>
                  <p className="mt-2 text-sm font-semibold text-white">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 p-6 sm:p-7">
            {[
              ['General Support', 'info@edu-mart.com', 'Product help, school onboarding and account questions'],
              ['Bulk Orders', 'school@edumart.com', 'School quotations, classroom bundles and annual supply requests'],
            ].map(([label, value, note]) => (
              <div key={label} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{label}</p>
                <p className="mt-2 text-lg font-extrabold text-slate-900">{value}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{note}</p>
              </div>
            ))}

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ['WhatsApp / Phone', '+91 90000 00000', 'Mon - Sat, 9 AM - 7 PM'],
                ['Order updates', 'Track via email or phone', 'Ask for quotations, status or procurement details'],
              ].map(([label, value, note]) => (
                <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{label}</p>
                  <p className="mt-2 text-lg font-extrabold text-slate-900">{value}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{note}</p>
                </div>
              ))}
            </div>

            <div className="rounded-3xl bg-slate-900 p-5 text-white shadow-lg">
              <h3 className="text-xl font-extrabold">What happens after you reach out?</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {['We review your request', 'We share pricing or next steps', 'We confirm the best support channel'].map((step, index) => (
                  <div key={step} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-[0.7rem] font-bold uppercase tracking-[0.22em] text-white/60">Step {index + 1}</p>
                    <p className="mt-2 text-sm leading-6 text-white/90">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <form className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">Send a message</p>
          <h2 className="mt-2 text-2xl font-extrabold text-slate-900">Tell us what you need</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Leave your details and a short message. We will use it to route your request to the right team.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <input className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none placeholder:text-slate-400" placeholder="Enter your name" />
            <input className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none placeholder:text-slate-400" placeholder="Enter your email" />
            <input className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none placeholder:text-slate-400 sm:col-span-2" placeholder="Enter your phone number" />
            <textarea className="min-h-36 rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none placeholder:text-slate-400 sm:col-span-2" placeholder="Enter your message" />
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              className="rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-bold text-white shadow-sm"
              onClick={() =>
                feedback.notifyInfo(
                  'Message send is in progress',
                  'The contact form is being wired up. Please use the email addresses shown on this page for now.',
                )
              }
            >
              Send Message
            </button>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              Prefer email? Use info@edu-mart.com
            </div>
          </div>
        </form>
      </div>
    </MarketingPageShell>
  )
}
