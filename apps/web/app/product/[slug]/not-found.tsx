import Link from 'next/link'

export default function ProductNotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl items-center px-4 py-16 text-center sm:px-6">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-lg sm:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-slate-500">Product not found</p>
        <h1 className="mt-3 text-3xl font-extrabold text-slate-900">This product is no longer available</h1>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          Try browsing the full shop or save another item for later from the wishlist.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/shop" className="rounded-xl bg-[#0B3558] px-5 py-3 text-sm font-bold text-white">
            Browse shop
          </Link>
          <Link href="/wishlist" className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700">
            Go to wishlist
          </Link>
        </div>
      </div>
    </main>
  )
}