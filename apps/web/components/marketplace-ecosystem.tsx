'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

type SchoolBlock = {
  name: string
  schools: string[]
}

type SchoolDistrict = {
  name: string
  blocks: SchoolBlock[]
}

type SchoolState = {
  state: string
  districts: SchoolDistrict[]
}

type ServiceCard = {
  key: string
  eyebrow: string
  title: string
  description: string
  bullets: string[]
  href: string
  accent: string
  stat: string
  icon: () => JSX.Element
}

function BookIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-[2]">
      <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4H20v14.5A2.5 2.5 0 0 1 17.5 21H6.5A2.5 2.5 0 0 1 4 18.5Z" />
      <path d="M8 8h8" />
      <path d="M8 11h8" />
      <path d="M8 14h5" />
    </svg>
  )
}

function HeartPulseIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-[2]">
      <path d="M12 20s-6.8-4.6-9-8.8C1.5 7.8 3.3 5 6.3 4.7c1.6-.2 3.2.5 4.1 1.8.9-1.3 2.5-2 4.1-1.8 3 .3 4.8 3.1 3.3 6.5C18.8 15.4 12 20 12 20Z" />
      <path d="M4.5 12.5h3l1.3-2.8 1.8 5 1.9-4 1.1 1.8h5" />
    </svg>
  )
}

function StethoscopeIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-[2]">
      <path d="M6 4v5a3 3 0 0 0 3 3h1" />
      <path d="M15 4v6a4 4 0 0 1-4 4h-1" />
      <path d="M8 12v1.5a4.5 4.5 0 1 0 9 0V12" />
      <circle cx="17.5" cy="19" r="1.5" />
    </svg>
  )
}

function SchoolIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-[2]">
      <path d="M3 11.5 12 6l9 5.5-9 5.5-9-5.5Z" />
      <path d="M6 13v4.5c0 .8 2.7 2.5 6 2.5s6-1.7 6-2.5V13" />
    </svg>
  )
}

const SERVICE_CARDS: ServiceCard[] = [
  {
    key: 'online-classes',
    eyebrow: 'Online Learning',
    title: 'Live classes, recorded lessons, and tutor discovery',
    description: 'A flexible learning lane for batch classes, 1-on-1 tutors, exam prep, and on-demand replays.',
    bullets: ['Live + recorded sessions', 'Tutor marketplace', 'Exam and skill tracks'],
    href: '/services#online-classes',
    accent: 'from-[#1d4ed8] via-[#2563eb] to-[#0b3558]',
    stat: 'Built for K-12 and beyond',
    icon: BookIcon,
  },
  {
    key: 'wellness-assessment',
    eyebrow: 'Wellness Partnerships',
    title: 'Personal wellness assessment and partner programs',
    description: 'Support wellness screenings, preventive care packages, and partner-led assessments in one place.',
    bullets: ['Assessment intake', 'Partner programs', 'Lifestyle guidance'],
    href: '/services#wellness',
    accent: 'from-[#0f766e] via-[#10b981] to-[#0b3558]',
    stat: 'For students, parents, and staff',
    icon: HeartPulseIcon,
  },
  {
    key: 'doctor-network',
    eyebrow: 'Fitness + Medical',
    title: 'Pan-India doctor list for physical fitness and care',
    description: 'A discovery layer for doctors, physiotherapists, and fitness specialists across India.',
    bullets: ['City and state search', 'Specialty filters', 'Appointment-ready layout'],
    href: '/services#doctors',
    accent: 'from-[#ea580c] via-[#f97316] to-[#7c2d12]',
    stat: 'Pan-India service network',
    icon: StethoscopeIcon,
  },
  {
    key: 'school-discovery',
    eyebrow: 'School Network',
    title: 'State, district, block, and school-wise discovery flow',
    description: 'A school-first funnel for selecting location, discovering institutions, and matching product needs.',
    bullets: ['Pan-India school list', 'State to block flow', 'Bulk request ready'],
    href: '/services#schools',
    accent: 'from-[#7c3aed] via-[#8b5cf6] to-[#14507e]',
    stat: 'School list by geography',
    icon: SchoolIcon,
  },
]

const SCHOOL_NETWORK: SchoolState[] = [
  {
    state: 'Maharashtra',
    districts: [
      {
        name: 'Pune',
        blocks: [
          { name: 'Haveli', schools: ['Pune Public School', 'Riverdale High'] },
          { name: 'Baramati', schools: ['Baramati Central School', 'Shivneri Vidyalaya'] },
        ],
      },
      {
        name: 'Nagpur',
        blocks: [
          { name: 'Nagpur Urban', schools: ['Orange City School', 'Sneh Vidya Mandir'] },
          { name: 'Hingna', schools: ['Vidya Niketan', 'Future Scholars School'] },
        ],
      },
    ],
  },
  {
    state: 'Karnataka',
    districts: [
      {
        name: 'Bengaluru Urban',
        blocks: [
          { name: 'North', schools: ['Silicon Valley School', 'Greenfield Academy'] },
          { name: 'South', schools: ['Nandini Vidyalaya', 'Crest International School'] },
        ],
      },
      {
        name: 'Mysuru',
        blocks: [
          { name: 'Mysuru City', schools: ['Royal Public School', 'Sri Chaitanya Academy'] },
          { name: 'Periyapatna', schools: ['Heritage School', 'Sunrise Children Academy'] },
        ],
      },
    ],
  },
  {
    state: 'West Bengal',
    districts: [
      {
        name: 'Kolkata',
        blocks: [
          { name: 'South Kolkata', schools: ['Bengal Central School', 'Lake View Academy'] },
          { name: 'North Kolkata', schools: ['Howrah Modern School', 'Cityline Public School'] },
        ],
      },
      {
        name: 'Hooghly',
        blocks: [
          { name: 'Chinsurah', schools: ['Hooghly Scholars', 'Delta High School'] },
          { name: 'Serampore', schools: ['Serampore Public School', 'Apex Academy'] },
        ],
      },
    ],
  },
  {
    state: 'Tamil Nadu',
    districts: [
      {
        name: 'Chennai',
        blocks: [
          { name: 'North Chennai', schools: ['Marina School', 'Bluebell Academy'] },
          { name: 'South Chennai', schools: ['Adyar Public School', 'Velachery Scholars'] },
        ],
      },
      {
        name: 'Coimbatore',
        blocks: [
          { name: 'Coimbatore East', schools: ['Nilgiri High School', 'Crescent Learning Hub'] },
          { name: 'Pollachi', schools: ['Pollachi Central School', 'STEM Future Academy'] },
        ],
      },
    ],
  },
]

function countSchools(state: SchoolState) {
  return state.districts.reduce((total, district) => {
    return total + district.blocks.reduce((districtTotal, block) => districtTotal + block.schools.length, 0)
  }, 0)
}

function getStateBranch(stateName: string) {
  return SCHOOL_NETWORK.find((state) => state.state === stateName) ?? SCHOOL_NETWORK[0]
}

function getDistrictBranch(state: SchoolState, districtName: string) {
  return state.districts.find((district) => district.name === districtName) ?? state.districts[0]
}

function getBlockBranch(district: SchoolDistrict, blockName: string) {
  return district.blocks.find((block) => block.name === blockName) ?? district.blocks[0]
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/65">{label}</p>
      <p className="mt-2 text-lg font-extrabold text-white">{value}</p>
    </div>
  )
}

export function MarketplaceEcosystem() {
  const [state, setState] = useState(SCHOOL_NETWORK[0].state)
  const [district, setDistrict] = useState(SCHOOL_NETWORK[0].districts[0].name)
  const [block, setBlock] = useState(SCHOOL_NETWORK[0].districts[0].blocks[0].name)
  const [school, setSchool] = useState(SCHOOL_NETWORK[0].districts[0].blocks[0].schools[0])

  const currentState = getStateBranch(state)
  const currentDistrict = getDistrictBranch(currentState, district)
  const currentBlock = getBlockBranch(currentDistrict, block)

  const schoolOptions = currentBlock.schools

  const visibleSchools = useMemo(() => {
    return currentState.districts.flatMap((districtItem) =>
      districtItem.blocks.flatMap((blockItem) =>
        blockItem.schools.map((schoolName) => ({
          state: currentState.state,
          district: districtItem.name,
          block: blockItem.name,
          school: schoolName,
        })),
      ),
    )
  }, [currentState])

  const focusPath = `${state} / ${district} / ${block} / ${school}`

  return (
    <section className="space-y-6">
      <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="p-6 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#0B3558]">Marketplace ecosystem</p>
            <h2 className="mt-3 max-w-3xl text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl">
              One front door for products, classes, wellness, doctors, and school discovery
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              The experience stays marketplace-first, but the front end now introduces the next growth lanes in a single visual system.
              Users can shop, learn, request wellness support, find doctors, and discover schools without leaving the brand.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <Metric label="Learning lane" value="Online classes" />
              <Metric label="Care lane" value="Wellness + doctors" />
              <Metric label="School lane" value="State to block flow" />
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/services" className="rounded-xl bg-[#0B3558] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:opacity-95">
                Open services hub
              </Link>
              <Link href="/shop" className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50">
                Continue shopping
              </Link>
            </div>
          </div>

          <div className="relative overflow-hidden bg-[radial-gradient(circle_at_top_right,_rgba(0,166,126,0.18)_0%,_rgba(255,255,255,0)_42%),linear-gradient(180deg,_#f8fbff_0%,_#eef7ff_100%)] p-6 sm:p-8">
            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-[#0B3558]/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-36 w-36 rounded-full bg-[#FF8A24]/15 blur-3xl" />

            <div className="relative grid gap-4">
              {SERVICE_CARDS.map((card) => {
                const Icon = card.icon

                return (
                  <Link
                    key={card.key}
                    href={card.href}
                    className={`group rounded-3xl bg-gradient-to-br ${card.accent} p-[1px] shadow-lg transition hover:-translate-y-0.5`}
                  >
                    <div className="rounded-[1.45rem] bg-white/95 p-4 backdrop-blur">
                      <div className="flex items-start gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg">
                          <Icon />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-[0.7rem] font-bold uppercase tracking-[0.22em] text-slate-500">{card.eyebrow}</p>
                            <span className="rounded-full bg-slate-100 px-2 py-1 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-slate-600">
                              {card.stat}
                            </span>
                          </div>
                          <h3 className="mt-1 text-base font-extrabold text-slate-900">{card.title}</h3>
                          <p className="mt-1 text-sm leading-6 text-slate-600">{card.description}</p>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {card.bullets.map((bullet) => (
                          <span key={bullet} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                            {bullet}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        {SERVICE_CARDS.map((card) => {
          const Icon = card.icon

          return (
            <Link
              key={card.key}
              id={card.key}
              href={card.href}
              className={`group overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg`}
            >
              <div className={`h-40 bg-gradient-to-br ${card.accent} p-4 text-white`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[0.68rem] font-bold uppercase tracking-[0.22em] opacity-80">{card.eyebrow}</p>
                    <h3 className="mt-2 max-w-[12rem] text-xl font-extrabold leading-tight">{card.title}</h3>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
                    <Icon />
                  </div>
                </div>
                <p className="mt-3 text-sm leading-6 text-white/90">{card.stat}</p>
              </div>
              <div className="p-5">
                <p className="text-sm leading-6 text-slate-600">{card.description}</p>
                <div className="mt-4 flex items-center justify-between text-sm font-bold text-[#0B3558]">
                  <span>View lane</span>
                  <span className="transition group-hover:translate-x-1">→</span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      <div id="schools" className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="p-6 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#0B3558]">Pan-India school discovery</p>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl">State, district, block, and school wise flow</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              This layout makes it easy to browse schools the way school teams actually work: start with state, narrow by district,
              then block, then school. The selected path can drive products, quotes, class packs, and service onboarding.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-slate-500">State</span>
                <select
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0B3558]"
                  value={state}
                  onChange={(event) => {
                    const nextState = getStateBranch(event.target.value)
                    const nextDistrict = nextState.districts[0]
                    const nextBlock = nextDistrict.blocks[0]

                    setState(nextState.state)
                    setDistrict(nextDistrict.name)
                    setBlock(nextBlock.name)
                    setSchool(nextBlock.schools[0])
                  }}
                >
                  {SCHOOL_NETWORK.map((item) => (
                    <option key={item.state} value={item.state}>
                      {item.state}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-slate-500">District</span>
                <select
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0B3558]"
                  value={district}
                  onChange={(event) => {
                    const nextDistrict = getStateBranch(state).districts.find((item) => item.name === event.target.value) ?? currentState.districts[0]
                    const nextBlock = nextDistrict.blocks[0]

                    setDistrict(nextDistrict.name)
                    setBlock(nextBlock.name)
                    setSchool(nextBlock.schools[0])
                  }}
                >
                  {currentState.districts.map((item) => (
                    <option key={item.name} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-slate-500">Block</span>
                <select
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0B3558]"
                  value={block}
                  onChange={(event) => {
                    const nextBlock = currentDistrict.blocks.find((item) => item.name === event.target.value) ?? currentDistrict.blocks[0]

                    setBlock(nextBlock.name)
                    setSchool(nextBlock.schools[0])
                  }}
                >
                  {currentDistrict.blocks.map((item) => (
                    <option key={item.name} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-slate-500">School</span>
                <select
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0B3558]"
                  value={school}
                  onChange={(event) => setSchool(event.target.value)}
                >
                  {schoolOptions.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-6 rounded-3xl bg-slate-50 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">Selected path</p>
              <p className="mt-2 break-words text-lg font-extrabold text-slate-900">{focusPath}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Use this as the anchor for class-wise catalogs, school onboarding, and district-level quote requests.
              </p>
            </div>
          </div>

          <div className="space-y-4 bg-[linear-gradient(180deg,_rgba(11,53,88,0.04)_0%,_rgba(255,255,255,1)_45%,_rgba(0,166,126,0.08)_100%)] p-6 sm:p-8">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">Coverage preview</p>
                  <h3 className="mt-2 text-xl font-extrabold text-slate-900">Pan-India school list preview</h3>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                  {countSchools(currentState)} schools in state
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {SCHOOL_NETWORK.map((item) => {
                  const schoolTotal = countSchools(item)
                  const active = item.state === currentState.state

                  return (
                    <button
                      key={item.state}
                      type="button"
                      onClick={() => {
                        const nextState = getStateBranch(item.state)
                        const nextDistrict = nextState.districts[0]
                        const nextBlock = nextDistrict.blocks[0]

                        setState(nextState.state)
                        setDistrict(nextDistrict.name)
                        setBlock(nextBlock.name)
                        setSchool(nextBlock.schools[0])
                      }}
                      className={`flex w-full items-center justify-between gap-4 rounded-2xl border px-4 py-3 text-left transition ${
                        active ? 'border-[#0B3558] bg-[#0B3558] text-white shadow-md' : 'border-slate-200 bg-slate-50 text-slate-800 hover:bg-white'
                      }`}
                    >
                      <span className="font-semibold">{item.state}</span>
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${active ? 'bg-white/15 text-white' : 'bg-white text-slate-600'}`}>
                        {schoolTotal.toLocaleString('en-IN')} schools
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">What this unlocks</p>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                  <li>School-wise product packs and uniform bundles</li>
                  <li>District quote requests for class and campus needs</li>
                  <li>Class matching for books, stationery, and kits</li>
                  <li>Partnership onboarding for services and assessments</li>
                </ul>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">Selected school</p>
                <h4 className="mt-2 text-lg font-extrabold text-slate-900">{school}</h4>
                <p className="mt-2 text-sm text-slate-600">{block}, {district}</p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-slate-700">
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-blue-700">Products</span>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">Classes</span>
                  <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-700">Quotes</span>
                  <span className="rounded-full bg-violet-50 px-3 py-1 text-violet-700">Partnerships</span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-5">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">Nearby school cards</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {visibleSchools.slice(0, 4).map((item) => (
                  <div key={`${item.state}-${item.district}-${item.block}-${item.school}`} className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-sm font-extrabold text-slate-900">{item.school}</p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      {item.state} / {item.district} / {item.block}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}