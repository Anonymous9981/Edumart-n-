'use client'

import { useMemo, useState } from 'react'

import { MarketingPageShell } from '../../components/marketing-page-shell'

type SchoolRecord = {
  name: string
  board: string
  rating: string
  reviews: string
  address: string
  phone: string
  hours: string
  website: string
  maps: string
  state: string
  district: string
  block: string
  note?: string
}

const SCHOOL_DATA: SchoolRecord[] = [
  {
    name: 'Ideal International CBSE School',
    board: 'CBSE School',
    rating: '4.4',
    reviews: '(373)',
    address: 'Govind Colony Main Road, Near Kamla Nehru Colony, Indore',
    phone: '096442 00400',
    hours: 'Open · Closes 6 pm',
    website: 'http://idealinternationalindore.com/',
    maps: 'https://www.google.com/maps/dir//Ideal+International+CBSE+School,+Govind+Colony+Main+Road,+Indore',
    state: 'Madhya Pradesh',
    district: 'Indore',
    block: 'Govind Colony',
    note: 'Highly recommended for quality education and overall growth.',
  },
  {
    name: 'IDEAL ACADEMY',
    board: 'CBSE School',
    rating: '4.4',
    reviews: '(366)',
    address: 'Sangam Nagar, Avantika, Indore',
    phone: '0731 261 7400',
    hours: 'Open · Closes 5 pm',
    website: 'http://www.idealacademyindore.com/',
    maps: 'https://www.google.com/maps/dir//IDEAL+ACADEMY,+Sangam+Nagar,+Indore',
    state: 'Madhya Pradesh',
    district: 'Indore',
    block: 'Avantika',
    note: 'Good infrastructure, qualified teachers, and quality education.',
  },
  {
    name: 'VIBGYOR Rise | School in Indore | CBSE',
    board: 'CBSE School',
    rating: '4.4',
    reviews: '(118)',
    address: 'Plot No 16, Scheme Number 78, Vijay Nagar, Indore',
    phone: '060030 00700',
    hours: 'Open · Closes 5 pm',
    website: 'https://www.vibgyorrise.com/school/indore/cbse/indore',
    maps: 'https://www.google.com/maps/dir//VIBGYOR+Rise+School+Indore',
    state: 'Madhya Pradesh',
    district: 'Indore',
    block: 'Vijay Nagar',
  },
  {
    name: 'Podar International School (CBSE) Indore - Vijaynagar',
    board: 'CBSE School',
    rating: '4.2',
    reviews: '(287)',
    address: 'Satya Sai Circle, Scheme No.74, AB Road, Indore',
    phone: '063664 37967',
    hours: 'Closes soon · 3 pm',
    website: 'http://www.podareducation.org/school/indore/',
    maps: 'https://www.google.com/maps/dir//Podar+International+School+Indore',
    state: 'Madhya Pradesh',
    district: 'Indore',
    block: 'Scheme 74',
  },
  {
    name: 'Indore Public School',
    board: 'CBSE School',
    rating: 'No reviews',
    reviews: '',
    address: 'Knowledge Village, Rajendra Nagar, AB Road, Indore',
    phone: '0731 401 4801',
    hours: 'Open',
    website: 'https://indorepublicschool.org/',
    maps: 'https://www.google.com/maps/dir//Indore+Public+School,+Rajendra+Nagar,+Indore',
    state: 'Madhya Pradesh',
    district: 'Indore',
    block: 'Rajendra Nagar',
  },
  {
    name: 'IPVM ORCHIDS The International School - Rajendra Nagar',
    board: 'CBSE School',
    rating: '4.4',
    reviews: '(72)',
    address: 'CAT Road, Rajendra Nagar, Indore',
    phone: '099994 31999',
    hours: 'Open · Closes 5 pm',
    website: 'https://www.orchidsinternationalschool.com/indore-branches/rajendra-nagar',
    maps: 'https://www.google.com/maps/dir//IPVM+ORCHIDS+Rajendra+Nagar+Indore',
    state: 'Madhya Pradesh',
    district: 'Indore',
    block: 'Rajendra Nagar',
    note: 'Staff is very good and co-curricular activities are impressive.',
  },
  {
    name: 'Garima Vidya Vihar Sr. Sec. School',
    board: 'CBSE School',
    rating: 'No reviews',
    reviews: '',
    address: 'Paul Hill, Airport Road, Opp Bijasan Mata Temple, Indore',
    phone: '070494 94919',
    hours: 'Open',
    website: 'https://www.garimaschool.com/',
    maps: 'https://www.google.com/maps/dir//Garima+Vidya+Vihar+Indore',
    state: 'Madhya Pradesh',
    district: 'Indore',
    block: 'Airport Road',
  },
  {
    name: 'Ryan International School, CAT Road, Indore',
    board: 'International School',
    rating: 'No reviews',
    reviews: '',
    address: 'Scheme No.97/4, CAT Road, Indore',
    phone: '0731 297 1041',
    hours: 'Open',
    website: 'https://www.ryangroup.org/ryaninternational/cbse/indore/ryan-international-school-cat-road',
    maps: 'https://www.google.com/maps/dir//Ryan+International+School+CAT+Road+Indore',
    state: 'Madhya Pradesh',
    district: 'Indore',
    block: 'CAT Road',
  },
]

export default function SchoolsPage() {
  const [state, setState] = useState('Madhya Pradesh')
  const [district, setDistrict] = useState('Indore')
  const [block, setBlock] = useState('All blocks')
  const [schoolQuery, setSchoolQuery] = useState('')

  const blocks = useMemo(() => {
    const uniqueBlocks = Array.from(new Set(SCHOOL_DATA.map((item) => item.block)))
    return ['All blocks', ...uniqueBlocks]
  }, [])

  const filteredSchools = useMemo(() => {
    const query = schoolQuery.trim().toLowerCase()

    return SCHOOL_DATA.filter((item) => {
      const matchesState = item.state === state
      const matchesDistrict = item.district === district
      const matchesBlock = block === 'All blocks' || item.block === block
      const matchesQuery =
        !query || `${item.name} ${item.board} ${item.address} ${item.note ?? ''}`.toLowerCase().includes(query)

      return matchesState && matchesDistrict && matchesBlock && matchesQuery
    })
  }, [state, district, block, schoolQuery])

  return (
    <MarketingPageShell
      eyebrow="School Flow"
      title="Pan-India school discovery"
      subtitle="State, district, block, and school wise flow for school-first onboarding and product discovery."
      accent="green"
      primaryCta={{ label: 'Browse Shop', href: '/shop' }}
      secondaryCta={{ label: 'View Services', href: '/services' }}
    >
      <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-extrabold text-slate-900">State, district, block, school flow</h2>
          <p className="mt-2 text-sm text-slate-600">Use this as an anchor for class-wise catalogs, onboarding, and quote requests.</p>

          <div className="mt-5 grid gap-3">
            <label className="text-sm font-semibold text-slate-700">
              State
              <input className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm" value={state} onChange={(event) => setState(event.target.value)} />
            </label>
            <label className="text-sm font-semibold text-slate-700">
              District
              <input className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm" value={district} onChange={(event) => setDistrict(event.target.value)} />
            </label>
            <label className="text-sm font-semibold text-slate-700">
              Block
              <select className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm" value={block} onChange={(event) => setBlock(event.target.value)}>
                {blocks.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </label>
            <label className="text-sm font-semibold text-slate-700">
              School
              <input
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm"
                placeholder="Search school name, board, address"
                value={schoolQuery}
                onChange={(event) => setSchoolQuery(event.target.value)}
              />
            </label>
          </div>

          <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
            Selected path: {state} / {district} / {block} / {filteredSchools[0]?.name ?? 'No school selected'}
          </div>
        </article>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredSchools.map((item) => (
            <article key={item.name} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="rounded-full bg-slate-100 px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.18em] text-slate-600 inline-block">
                {item.board}
              </div>
              <h3 className="mt-3 text-lg font-extrabold text-slate-900">{item.name}</h3>
              <p className="mt-1 text-sm text-slate-600">{item.address}</p>
              <div className="mt-3 text-sm text-slate-600 space-y-1">
                <p>{item.hours}</p>
                <p>{item.phone}</p>
                <p>{item.rating} {item.reviews}</p>
              </div>
              {item.note ? <p className="mt-3 text-sm italic text-slate-500">&quot;{item.note}&quot;</p> : null}
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <a href={item.website} target="_blank" rel="noreferrer" className="rounded-xl border border-slate-300 px-4 py-2 text-center text-sm font-bold text-slate-700">Website</a>
                <a href={item.maps} target="_blank" rel="noreferrer" className="rounded-xl bg-[#0B3558] px-4 py-2 text-center text-sm font-bold text-white">Maps</a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </MarketingPageShell>
  )
}
