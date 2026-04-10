'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'

import { AppHeader } from './app-header'

import type { HomepageAudience, HomepageData, HomepageProduct } from '../lib/homepage-types'
import { useMarketplaceState } from '../lib/marketplace-state'
import { useSiteFeedback } from '../lib/site-feedback'

const BRAND = {
  navy: '#0B3558',
  teal: '#00A67E',
  amber: '#FF8A24',
  blue: '#2563eb',
  orange: '#f97316',
  green: '#10b981',
}

const inr = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

function CartIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-[2]">
      <path d="M3 4h2l2.2 10.5a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 8H6.2" />
      <circle cx="10" cy="20" r="1.5" />
      <circle cx="17" cy="20" r="1.5" />
    </svg>
  )
}

function PlusCartIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-[2]">
      <path d="M3 5h2l2.2 9.5a2 2 0 0 0 2 1.5h7.8a2 2 0 0 0 2-1.5L21 9H6.2" />
      <path d="M10.5 12V6.5" />
      <path d="M7.75 9.25h5.5" />
      <circle cx="10" cy="19.5" r="1.5" />
      <circle cx="17" cy="19.5" r="1.5" />
    </svg>
  )
}

function HeartIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-[2]">
      <path d="M12 21s-7-4.8-9.2-9.4C1 8.2 2.7 5.5 5.8 5.1c1.7-.2 3.4.6 4.2 1.9.8-1.3 2.5-2.1 4.2-1.9 3.1.4 4.8 3.1 3 6.5C19 16.2 12 21 12 21Z" />
    </svg>
  )
}

function HomeIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-[2]">
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5.5 9.5V21h13V9.5" />
    </svg>
  )
}

function ShopIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-[2]">
      <path d="M4 8h16l-1.2 11a2 2 0 0 1-2 1.8H7.2a2 2 0 0 1-2-1.8L4 8Z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  )
}

type OfferType = 'PERCENTAGE' | 'FIXED'

function getOffer(product: HomepageProduct): {
  type: OfferType
  value: number
  finalPrice: number
  savings: number
  badge: string
  label: string
} {
  const base = Math.max(product.price, 0)

  if (product.discountType === 'FIXED' && (product.discountValue ?? 0) > 0) {
    const finalPrice = Math.max(base - (product.discountValue ?? 0), 0)
    const displayFinal = Math.min(finalPrice, product.finalPrice || finalPrice)
    const savings = Math.max(base - displayFinal, 0)

    return {
      type: 'FIXED',
      value: product.discountValue ?? 0,
      finalPrice: displayFinal,
      savings,
      badge: `${inr.format(product.discountValue ?? 0)} OFF`,
      label: `${inr.format(product.discountValue ?? 0)} discount auto applied`,
    }
  }

  const percentage = product.discountType === 'PERCENTAGE'
    ? product.discountValue ?? product.discountPercentage
    : product.discountPercentage

  const safePercentage = Math.max(percentage, 0)
  const finalPrice = Math.round(base * (100 - safePercentage) / 100)
  const fallbackFinal = product.finalPrice > 0 ? product.finalPrice : finalPrice
  const displayFinal = Math.min(finalPrice, fallbackFinal)
  const savings = Math.max(base - displayFinal, 0)

  return {
    type: 'PERCENTAGE',
    value: safePercentage,
    finalPrice: displayFinal,
    savings,
    badge: `${Math.round(safePercentage)}% OFF`,
    label: `${Math.round(safePercentage)}% discount auto applied`,
  }
}

function HeroBanner(props: {
  audience: HomepageAudience
  title: string
  subtitle: string
  image: string
  buttonLabel: string
  onExplore: () => void
}) {
  return (
    <article
      className={`overflow-hidden rounded-3xl border text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
        props.audience === 'student'
          ? 'border-blue-500/40 bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-700'
          : 'border-orange-500/40 bg-gradient-to-br from-orange-600 via-orange-700 to-red-600'
      }`}
    >
      <div className="grid gap-4 p-5 sm:p-6 md:grid-cols-[1.2fr_0.8fr] md:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-90">
            {props.audience === 'student' ? 'Student Collection' : 'School Collection'}
          </p>
          <h2 className="mt-2 text-2xl font-extrabold leading-tight sm:text-3xl">{props.title}</h2>
          <p className="mt-2 text-sm leading-6 opacity-95 sm:text-base">{props.subtitle}</p>
          <button
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-bold"
            style={{ color: props.audience === 'student' ? BRAND.blue : BRAND.orange }}
            onClick={props.onExplore}
          >
            {props.buttonLabel}
            <span>→</span>
          </button>
        </div>

        <div className="rounded-2xl bg-white/15 p-2">
          <img
            src={props.image}
            alt={props.title}
            className="h-40 w-full rounded-xl object-cover object-center sm:h-48"
          />
        </div>
      </div>
    </article>
  )
}

function ProductCard({ product }: { product: HomepageProduct }) {
  const offer = getOffer(product)
  const marketplace = useMarketplaceState()
  const feedback = useSiteFeedback()
  const inCart = marketplace.isInCart(product.id)
  const inWishlist = marketplace.isInWishlist(product.id)

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-56 overflow-hidden bg-slate-100">
        <Link href={`/product/${product.slug}`} className="block h-full w-full">
          <img src={product.image} alt={product.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        </Link>
        <Link
          href={`/product/${product.slug}`}
          className="absolute inset-x-3 bottom-3 inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-900 opacity-0 shadow-lg transition group-hover:opacity-100"
        >
          View details
        </Link>
        <div className="absolute right-3 top-3 rounded-md bg-orange-500 px-2 py-1 text-xs font-bold text-white">
          {offer.badge}
        </div>
      </div>

      <div className="p-4">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">{product.vendor}</p>
        <Link href={`/product/${product.slug}`} className="mt-2 block text-base font-extrabold leading-6 text-slate-900 transition hover:text-[#0B3558]">
          {product.title}
        </Link>
        <p className="mt-1 text-xs font-semibold uppercase tracking-wide" style={{ color: BRAND.teal }}>
          {product.category}
        </p>

        <div className="mt-3 flex items-center gap-2 text-sm">
          <span className="rounded bg-amber-300 px-2 py-0.5 font-bold text-slate-900">{product.rating.toFixed(1)} ★</span>
          <span className="text-slate-600">{product.reviews.toLocaleString('en-IN')} reviews</span>
        </div>

        <div className="mt-3 flex flex-wrap items-end gap-2">
          <span className="text-2xl font-extrabold text-slate-900">{inr.format(offer.finalPrice)}</span>
          <span className="text-sm text-slate-400 line-through">{inr.format(product.price)}</span>
          <span className="text-xs font-bold text-emerald-700">Save {inr.format(offer.savings)}</span>
        </div>

        <p className="mt-1 text-xs font-semibold text-emerald-700">{offer.label}</p>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <button
            className="rounded-lg px-4 py-2 text-sm font-bold text-white transition hover:opacity-90"
            style={{ backgroundColor: BRAND.blue }}
            onClick={() => {
              const added = marketplace.addToCart(product.id, 1)

              if (added) {
                feedback.notifySuccess('Added to cart', `${product.title} is now in your cart.`)
                return
              }

              feedback.notifyWarning('Already in cart', `${product.title} is already saved in your cart.`)
            }}
          >
            <span className="inline-flex items-center gap-2">
              <PlusCartIcon />
              <span>{inCart ? 'Already in cart' : 'Add to Cart'}</span>
            </span>
          </button>
          <button
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            onClick={() => {
              marketplace.toggleWishlist(product.id)
              feedback.notifyInfo(
                inWishlist ? 'Removed from wishlist' : 'Saved to wishlist',
                inWishlist
                  ? `${product.title} has been removed from your wishlist.`
                  : `${product.title} is now available in your wishlist.`,
              )
            }}
          >
            <span className="inline-flex items-center gap-2">
              <HeartIcon />
              <span>{inWishlist ? 'Saved' : 'Save'}</span>
            </span>
          </button>
        </div>
      </div>
    </article>
  )
}

export function HomepageClient({ initialData }: { initialData: HomepageData }) {
  const router = useRouter()
  const marketplace = useMarketplaceState()
  const feedback = useSiteFeedback()
  const [audience, setAudience] = useState<HomepageAudience>('student')
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const [selectedSchool, setSelectedSchool] = useState('')
  const [selectedClass, setSelectedClass] = useState('')
  const cartCount = Object.values(marketplace.cart).reduce((total, quantity) => total + quantity, 0)
  const wishlistCount = marketplace.wishlist.length

  const activeProducts = useMemo(
    () => initialData.products.filter((product) => product.audience === audience),
    [audience, initialData.products],
  )

  const categories = useMemo(() => {
    const unique = Array.from(new Set(activeProducts.map((product) => product.category)))
    return ['All', ...unique]
  }, [activeProducts])

  const visibleProducts = useMemo(() => {
    return activeProducts.filter((product) => activeCategory === 'All' || product.category === activeCategory)
  }, [activeCategory, activeProducts])

  const schoolProducts = useMemo(() => {
    if (!selectedClass) {
      return []
    }

    return initialData.products
      .filter((product) => product.audience === 'student')
      .filter((product) => !product.schoolClasses || product.schoolClasses.includes(selectedClass))
      .slice(0, 4)
  }, [initialData.products, selectedClass])

  const featuredStores = useMemo(() => {
    const storeMap = new Map<
      string,
      {
        name: string
        products: number
        audience: Set<HomepageAudience>
      }
    >()

    initialData.products.forEach((product) => {
      const existing = storeMap.get(product.vendor)

      if (existing) {
        existing.products += 1
        existing.audience.add(product.audience)
        return
      }

      storeMap.set(product.vendor, {
        name: product.vendor,
        products: 1,
        audience: new Set([product.audience]),
      })
    })

    return Array.from(storeMap.values())
      .sort((left, right) => right.products - left.products)
      .slice(0, 4)
  }, [initialData.products])

  const schoolList = ['Sunrise Public School', 'Green Valley School', 'Scholars Academy', 'Vidya Global School']
  const classList = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
  const activeAudienceLabel = audience === 'student' ? 'Student' : 'School'

  function goToRoute(pathname: string) {
    router.push(pathname)
  }

  return (
    <main className="pb-24 text-slate-900 lg:pb-0">
      <div className="px-4 py-2 text-center text-xs font-semibold text-white sm:text-sm" style={{ backgroundColor: BRAND.navy }}>
        New user offer: Extra 10% off + free delivery on first order
      </div>

      <AppHeader />

      <section className="mx-auto max-w-7xl px-4 pt-5 sm:px-6">
        <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-sm backdrop-blur md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Browse by audience</p>
            <h2 className="mt-1 text-lg font-extrabold text-slate-900">Switch between student essentials and school supplies</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              ['student', 'Student'],
              ['teacher', 'School'],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => {
                  setAudience(value as HomepageAudience)
                  setActiveCategory('All')
                }}
                className={`rounded-full px-4 py-2 text-sm font-bold transition ${audience === value ? 'text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                style={audience === value ? { backgroundColor: value === 'student' ? BRAND.navy : BRAND.amber } : undefined}
              >
                {label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => goToRoute('/schools')}
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
            >
              Open school flow
            </button>
          </div>
        </div>
      </section>

      <section id="home" className="mx-auto grid max-w-7xl gap-5 px-4 pb-4 pt-5 sm:px-6 lg:grid-cols-2">
        <HeroBanner
          audience="student"
          title="Student essentials with better pricing"
          subtitle="Books, stationery, uniforms and learning kits with automatic discount application."
          image="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80"
          buttonLabel="Shop Student Products"
          onExplore={() => {
            setAudience('student')
            goToRoute('/shop')
          }}
        />
        <HeroBanner
          audience="teacher"
          title="School infrastructure and teacher tools"
          subtitle="Assessment systems, classroom tech and event solutions for institutions."
          image="https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=1200&q=80"
          buttonLabel="Explore School Products"
          onExplore={() => {
            setAudience('teacher')
            goToRoute('/schools')
          }}
        />
      </section>

      <section id="catalog" className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="inline-flex rounded-xl bg-blue-50 px-3 py-1 text-2xl font-extrabold text-blue-700 sm:text-3xl">
            Shop by Category
          </h2>
          <div className="text-sm font-semibold text-slate-500">Viewing {activeAudienceLabel} products</div>
        </div>
        <p className="mt-2 text-sm text-slate-600">Choose category and audience, all prices already include auto-applied offers.</p>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => {
              setAudience('student')
              setActiveCategory('All')
            }}
            className={`rounded-full px-4 py-2 text-sm font-bold transition ${audience === 'student' ? 'text-white' : 'bg-slate-100 text-slate-700'}`}
            style={audience === 'student' ? { backgroundColor: BRAND.navy } : undefined}
          >
            Student Products
          </button>
          <button
            type="button"
            onClick={() => {
              setAudience('teacher')
              setActiveCategory('All')
            }}
            className={`rounded-full px-4 py-2 text-sm font-bold transition ${audience === 'teacher' ? 'text-white' : 'bg-slate-100 text-slate-700'}`}
            style={audience === 'teacher' ? { backgroundColor: BRAND.amber } : undefined}
          >
            School Products
          </button>
        </div>

        <div className="mt-4 sm:hidden">
          <select
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none"
            value={activeCategory}
            onChange={(event) => setActiveCategory(event.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4 no-scrollbar flex gap-2 overflow-x-auto whitespace-nowrap rounded-2xl border border-slate-200 bg-white p-3">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                activeCategory === category ? 'text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
              style={activeCategory === category ? { backgroundColor: BRAND.navy } : undefined}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {visibleProducts.length ? (
            visibleProducts.map((product) => <ProductCard key={product.id} product={product} />)
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600 sm:col-span-2 xl:col-span-3">
              No products match the current filter. Switch audience or category to see more items.
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="inline-flex rounded-xl bg-emerald-50 px-3 py-1 text-2xl font-extrabold text-emerald-700 sm:text-3xl">
                Featured Stores
              </h2>
              <p className="mt-2 text-sm text-slate-600">The most visible vendors based on the current product catalog.</p>
            </div>
            <button
              type="button"
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              onClick={() => goToRoute('/shop')}
            >
              Browse all stores
            </button>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {featuredStores.map((store) => (
              <article key={store.name} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Vendor</p>
                <h3 className="mt-2 text-lg font-extrabold text-slate-900">{store.name}</h3>
                <p className="mt-2 text-sm text-slate-600">{store.products.toLocaleString('en-IN')} products listed</p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
                  {Array.from(store.audience).map((item) => (
                    <span key={item} className="rounded-full bg-white px-3 py-1 text-slate-700 shadow-sm">
                      {item === 'student' ? 'Student' : 'School'}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="school-flow" className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <h2 className="inline-flex rounded-xl bg-blue-50 px-3 py-1 text-2xl font-extrabold text-blue-700 sm:text-3xl">
          School to Class Product Flow
        </h2>
        <p className="mt-2 text-sm text-slate-600">Select school, then class, then get relevant products instantly.</p>

        <div className="mt-4 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-2">
          <select
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none"
            value={selectedSchool}
            onChange={(event) => setSelectedSchool(event.target.value)}
          >
            <option value="">Select school</option>
            {schoolList.map((school) => (
              <option key={school} value={school}>{school}</option>
            ))}
          </select>

          <select
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none"
            value={selectedClass}
            onChange={(event) => setSelectedClass(event.target.value)}
            disabled={!selectedSchool}
          >
            <option value="">Select class</option>
            {classList.map((entry) => (
              <option key={entry} value={entry}>Class {entry}</option>
            ))}
          </select>
        </div>

        {selectedSchool && selectedClass ? (
          <div className="mt-5">
            <p className="text-sm font-semibold text-slate-700">
              Showing products for {selectedSchool} - Class {selectedClass}
            </p>
            <div className="mt-4 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {schoolProducts.map((product) => (
                <ProductCard key={`school-${product.id}`} product={product} />
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
            Select both school and class to view class-matched products.
          </div>
        )}
      </section>

      <section id="offers" className="mx-auto max-w-7xl gap-5 px-4 py-8 sm:px-6 md:grid md:grid-cols-2">
        <article className="overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 to-purple-700 p-6 text-white shadow-lg">
          <div className="text-sm font-bold uppercase tracking-wide opacity-90">Prime Membership</div>
          <h3 className="mt-2 text-3xl font-extrabold">EduMart Prime</h3>
          <p className="mt-2 text-sm leading-6 opacity-95">Monthly plan at ₹199 with 4 free deliveries every month.</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>✓ 4 free deliveries/month</li>
            <li>✓ Early sale access</li>
            <li>✓ Exclusive member-only deals</li>
          </ul>
          <button
            className="mt-4 w-full rounded-lg bg-amber-300 px-4 py-2 font-bold text-purple-900"
            onClick={() => feedback.notifyInfo('Prime membership', 'EduMart Prime is being prepared for launch. This feature is in progress.')}
          >
            Join Prime - ₹199/month
          </button>
        </article>

        <article className="overflow-hidden rounded-2xl bg-gradient-to-br from-green-600 to-emerald-700 p-6 text-white shadow-lg">
          <div className="text-sm font-bold uppercase tracking-wide opacity-90">Refer and Earn</div>
          <h3 className="mt-2 text-3xl font-extrabold">Get ₹100 Reward</h3>
          <p className="mt-2 text-sm leading-6 opacity-95">
            Earn ₹100 on every successful referral. Referral discount can be used only on orders above ₹499.
          </p>
          <div className="mt-4 rounded-lg bg-white/15 p-3 text-sm">
            Rule: Minimum order value for referral discount = ₹499
          </div>
          <button
            className="mt-4 w-full rounded-lg bg-white px-4 py-2 font-bold text-green-700"
            onClick={() => feedback.notifyInfo('Referral rewards', 'Referral code generation is currently in progress. Please check back soon.')}
          >
            Refer Now
          </button>
        </article>
      </section>

      <section id="about" className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <h2 className="inline-flex rounded-xl bg-blue-50 px-3 py-1 text-2xl font-extrabold text-blue-700 sm:text-3xl">
          About EduMart
        </h2>
        <p className="mt-3 text-sm leading-7 text-slate-700">
          EduMart is a school commerce platform helping students, parents and institutions purchase quality academic products at trusted prices.
          We work directly with verified vendors, maintain strict product checks, and deliver across urban and semi-urban India with reliable fulfillment.
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Products Delivered</p>
            <p className="mt-2 text-2xl font-extrabold text-slate-900">2,40,000+</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Vendors Associated</p>
            <p className="mt-2 text-2xl font-extrabold text-slate-900">1,800+</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Avg Delivery Time</p>
            <p className="mt-2 text-2xl font-extrabold text-slate-900">24-48 hrs</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">School Partners</p>
            <p className="mt-2 text-2xl font-extrabold text-slate-900">950+</p>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="text-lg font-extrabold text-slate-900">How We Work</h3>
          <p className="mt-2 text-sm text-slate-700">
            Vendor onboarding to product QA to pricing validation to auto-discount application to fast dispatch to post-delivery support.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">Trusted Vendor Network</span>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-blue-700">Fast Delivery Commitment</span>
            <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-700">Secure Checkout</span>
            <span className="rounded-full bg-violet-50 px-3 py-1 text-violet-700">Real-Time Order Tracking</span>
          </div>
        </div>

        <button
          type="button"
          className="mt-5 rounded-xl px-6 py-3 text-sm font-bold text-white"
          style={{ backgroundColor: BRAND.navy }}
          onClick={() => goToRoute('/shop')}
        >
          Order Products Now
        </button>
      </section>

      <section id="faq" className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <h2 className="inline-flex rounded-xl bg-blue-50 px-3 py-1 text-2xl font-extrabold text-blue-700 sm:text-3xl">
          Frequently Asked Questions
        </h2>

        <div className="mt-4 space-y-3">
          {[
            {
              q: 'How does automatic discount application work?',
              a: 'Discounts are applied instantly on product cards and checkout, in percentage or fixed amount format.',
            },
            {
              q: 'Can schools buy in bulk with custom quotations?',
              a: 'Yes, schools can request quote-based pricing for large quantity orders and infrastructure products.',
            },
            {
              q: 'What is the minimum order value for referral discount?',
              a: 'Referral rewards can be used only when order total is above ₹499.',
            },
            {
              q: 'What benefits are included in EduMart Prime?',
              a: 'Prime includes 4 free deliveries per month, early access to sales and members-only promotions.',
            },
            {
              q: 'How fast are deliveries completed?',
              a: 'Most orders are delivered within 24-48 hours based on location and vendor inventory.',
            },
          ].map((item) => (
            <article key={item.q} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900">{item.q}</h3>
              <p className="mt-1 text-sm text-slate-600">{item.a}</p>
            </article>
          ))}
        </div>

        <button
          type="button"
          className="mt-4 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
          onClick={() => goToRoute('/faq')}
        >
          See All FAQ
        </button>
      </section>

      <section id="contact" className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <h2 className="inline-flex rounded-xl bg-blue-50 px-3 py-1 text-2xl font-extrabold text-blue-700 sm:text-3xl">
          Contact Us
        </h2>

        <form className="mt-4 grid gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-2" onSubmit={(event) => event.preventDefault()}>
          <input
            className="rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400"
            placeholder="Enter your name"
          />
          <input
            className="rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400"
            placeholder="Enter your email"
          />
          <input
            className="rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 sm:col-span-2"
            placeholder="Enter your phone number"
          />
          <textarea
            className="min-h-28 rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 sm:col-span-2"
            placeholder="Enter your message"
          />
          <button
            className="rounded-xl px-4 py-3 text-sm font-bold text-white sm:w-fit"
            style={{ backgroundColor: BRAND.navy }}
          >
            Send Message
          </button>
        </form>
      </section>

      <footer className="mt-8 border-t border-slate-200 bg-slate-900 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm sm:px-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-base font-black text-[#0b3558] shadow-lg">E</span>
              <div>
                <p className="text-base font-extrabold text-white">EduMart</p>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">info@edu-mart.com</p>
              </div>
            </div>
            <p className="mt-3 max-w-md text-slate-300">© 2026 EduMart. Built for students, parents and schools.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              ['Home', '/'],
              ['Shop', '/shop'],
              ['About', '/about'],
              ['FAQ', '/faq'],
              ['Contact', '/contact'],
            ].map(([label, href]) => (
              <button
                key={href}
                type="button"
                className="rounded-md bg-white/10 px-3 py-1 text-xs font-semibold text-slate-100"
                onClick={() => goToRoute(href)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </footer>

    </main>
  )
}
