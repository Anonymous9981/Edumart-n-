'use client'

import { useMemo, useState } from 'react'

import { MarketingPageShell } from '../../components/marketing-page-shell'

type DoctorRecord = {
  name: string
  specialty: string
  rating: string
  reviews: string
  address: string
  phone: string
  hours: string
  website: string
  maps: string
  area: string
  note?: string
}

const DOCTOR_DATA: DoctorRecord[] = [
  {
    name: 'Dr Manish Verma',
    specialty: 'Pediatrician',
    rating: '4.9',
    reviews: '(96)',
    address: '1st floor, Milinda Manour, RNT Marg, above Bata Showroom, Indore',
    phone: '098273 03262',
    hours: 'Closes soon · 3:30 pm',
    website: 'https://mymedisage.com/profile/236843',
    maps: 'https://www.google.com/maps/dir//Dr+Manish+Verma+Indore',
    area: 'RNT Marg',
    note: 'Very gentle with kids and has brilliant diagnosis.',
  },
  {
    name: 'Dr Sanjay Jain Nitya Child Care And Vaccination Clinic',
    specialty: 'Pediatrician',
    rating: '4.9',
    reviews: '(1.2K)',
    address: 'Mourya Centre, Race Course Road, opposite Basket Ball Complex, Indore',
    phone: '091314 80492',
    hours: 'Closed · Opens 5 pm',
    website: 'http://www.pediatricianindore.com/',
    maps: 'https://www.google.com/maps/dir//Dr+Sanjay+Jain+Nitya+Child+Care+Indore',
    area: 'Race Course Road',
    note: 'Behavior and children handling are top notch.',
  },
  {
    name: 'Dr Priyanka Jain',
    specialty: 'Pediatrician',
    rating: '5.0',
    reviews: '(91)',
    address: '410, TBC Tower, Gita Bhawan Road, near I-Bus Stop, Indore',
    phone: '062637 81850',
    hours: 'Closed · Opens 4 pm',
    website: 'https://childspecialistindore.in/',
    maps: 'https://www.google.com/maps/dir//Dr+Priyanka+Jain+Gita+Bhawan+Indore',
    area: 'Gita Bhawan',
  },
  {
    name: 'Dr Varun Garg',
    specialty: 'Pediatrician',
    rating: '4.8',
    reviews: '(61)',
    address: 'Apple Hospital, near Bhawarkuan Square, Indore',
    phone: '070009 76018',
    hours: 'Open · Closes 6 pm',
    website: 'https://www.drvarungarg.com/',
    maps: 'https://www.google.com/maps/dir//Dr+Varun+Garg+Indore',
    area: 'Bhawarkuan',
  },
  {
    name: 'Dr Akshay Wanvat',
    specialty: 'Doctor',
    rating: '5.0',
    reviews: '(152)',
    address: 'Jayleen Multispeciality Clinic, 60 Feet Road, Mahalaxmi Nagar, Indore',
    phone: '079744 17399',
    hours: 'Open · Closes 9 pm',
    website: 'https://drakshaywanvatpedia.com/',
    maps: 'https://www.google.com/maps/dir//Dr+Akshay+Wanvat+Indore',
    area: 'Mahalaxmi Nagar',
    note: 'Highly recommended for pediatric care.',
  },
  {
    name: 'Dr Anurag Sapna Mittal',
    specialty: 'Pediatrician',
    rating: '4.9',
    reviews: '(184)',
    address: '501, Tilak Nagar Main Road, Indore',
    phone: '093021 01356',
    hours: 'Closed · Opens 6:30 pm',
    website: '',
    maps: 'https://www.google.com/maps/dir//Dr+Anurag+Sapna+Mittal+Indore',
    area: 'Tilak Nagar',
    note: 'Timely vaccinations and strong follow-up support.',
  },
  {
    name: 'Dr Nilesh Jain',
    specialty: 'Pediatrician',
    rating: '4.9',
    reviews: '(142)',
    address: 'F-13, Parshvanath Appt, Mig Colony, Indore',
    phone: '098262 84937',
    hours: 'Closes soon · 3:30 pm',
    website: '',
    maps: 'https://www.google.com/maps/dir//Dr+Nilesh+Jain+Indore',
    area: 'Mig Colony',
    note: 'Calm supervision and parent guidance.',
  },
  {
    name: 'Dr Krati Mehta',
    specialty: 'Pediatrician',
    rating: '4.8',
    reviews: '(123)',
    address: '79, Sudama Nagar Main Road, Opp Ranjeet Hanuman, Indore',
    phone: '099265 63163',
    hours: 'Closed · Opens 7:30 pm',
    website: '',
    maps: 'https://www.google.com/maps/dir//Dr+Krati+Mehta+Indore',
    area: 'Sudama Nagar',
  },
  {
    name: 'Dr Prakhar Nyati',
    specialty: 'Doctor',
    rating: '5.0',
    reviews: '(250)',
    address: '15A, Near Agrawal Nagar Bus Stand, Navlakha, Indore',
    phone: '090398 58755',
    hours: 'Closed · Opens 7 pm',
    website: '',
    maps: 'https://www.google.com/maps/dir//Dr+Prakhar+Nyati+Indore',
    area: 'Navlakha',
    note: 'A trusted partner in child health journey.',
  },
  {
    name: 'Dr Anubha Gangrade',
    specialty: 'Pediatrician',
    rating: '5.0',
    reviews: '(100)',
    address: 'Kailash Park, Manorama Ganj, Indore',
    phone: '098270 67632',
    hours: 'Closed · Opens 6 pm',
    website: '',
    maps: 'https://www.google.com/maps/dir//Dr+Anubha+Gangrade+Indore',
    area: 'Manorama Ganj',
  },
  {
    name: 'Dr Shadab Husain',
    specialty: 'Child Specialist',
    rating: '4.5',
    reviews: '(69)',
    address: 'Jawahar Marg, near Bombay Bazar, Indore',
    phone: '096170 91983',
    hours: 'Opens soon · 3 pm',
    website: 'https://www.instagram.com/yourpediatricks/',
    maps: 'https://www.google.com/maps/dir//Dr+Shadab+Husain+Indore',
    area: 'Bombay Bazar',
    note: 'Known for quick and effective treatment.',
  },
  {
    name: 'Dr Palak Vinayaka Bagora',
    specialty: 'Paediatrician',
    rating: '4.9',
    reviews: '(83)',
    address: 'Vyankatesh Nagar, Airport Road, Indore',
    phone: '070677 20059',
    hours: 'Closed · Opens 6 pm',
    website: 'https://clinikaa.com/',
    maps: 'https://www.google.com/maps/dir//Dr+Palak+Vinayaka+Bagora+Indore',
    area: 'Airport Road',
    note: 'Excellent pediatric care and treatment outcomes.',
  },
]

const SPECIALTIES = ['All specialties', 'Pediatrician', 'Child Specialist', 'Paediatrician', 'Doctor']

export default function DoctorsPage() {
  const [query, setQuery] = useState('')
  const [specialty, setSpecialty] = useState('All specialties')

  const filteredDoctors = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return DOCTOR_DATA.filter((item) => {
      const matchesSpecialty = specialty === 'All specialties' || item.specialty === specialty
      const matchesQuery =
        !normalizedQuery ||
        `${item.name} ${item.specialty} ${item.address} ${item.area} ${item.note ?? ''}`.toLowerCase().includes(normalizedQuery)

      return matchesSpecialty && matchesQuery
    })
  }, [query, specialty])

  return (
    <MarketingPageShell
      eyebrow="Find Healthcare"
      title="Kids doctors in Indore"
      subtitle="Browse pediatricians and child specialists with ratings, contact details, and direct map links."
      accent="blue"
      primaryCta={{ label: 'Browse Shop', href: '/shop' }}
      secondaryCta={{ label: 'View Services', href: '/services' }}
    >
      <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-extrabold text-slate-900">Doctor discovery</h2>
          <p className="mt-2 text-sm text-slate-600">Filter by specialty or search by doctor name and area.</p>

          <div className="mt-5 space-y-3">
            <label className="text-sm font-semibold text-slate-700">
              Specialty
              <select className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm" value={specialty} onChange={(event) => setSpecialty(event.target.value)}>
                {SPECIALTIES.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </label>
            <label className="text-sm font-semibold text-slate-700">
              Search
              <input
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm"
                placeholder="Search doctor name, area, clinic"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
          </div>

          <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">Showing {filteredDoctors.length} doctor profiles</div>
        </article>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredDoctors.map((item, index) => (
            <article key={`${item.name}-${item.area}-${index}`} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="rounded-full bg-slate-100 px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.18em] text-slate-600 inline-block">
                {item.specialty}
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
                {item.website ? (
                  <a href={item.website} target="_blank" rel="noreferrer" className="rounded-xl border border-slate-300 px-4 py-2 text-center text-sm font-bold text-slate-700">Website</a>
                ) : (
                  <div className="rounded-xl border border-slate-200 px-4 py-2 text-center text-sm font-bold text-slate-400">Website</div>
                )}
                <a href={item.maps} target="_blank" rel="noreferrer" className="rounded-xl bg-[#0B3558] px-4 py-2 text-center text-sm font-bold text-white">Maps</a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </MarketingPageShell>
  )
}
