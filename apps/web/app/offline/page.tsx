import Image from 'next/image'
import Link from 'next/link'

export default function OfflinePage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="mx-auto flex min-h-screen w-full max-w-xl flex-col items-center justify-center gap-5 px-6 text-center">
        <Image
          src="/brand/karom-edumart-full.webp"
          alt="Karom EduMart"
          width={220}
          height={220}
          priority
          className="h-auto w-[220px]"
        />
        <h1 className="text-2xl font-extrabold">You are offline</h1>
        <p className="max-w-md text-sm text-slate-600">
          EduMart is running in app mode. Check your internet connection and retry to continue shopping.
        </p>
        <Link
          href="/"
          className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Retry Home
        </Link>
      </section>
    </main>
  )
}
