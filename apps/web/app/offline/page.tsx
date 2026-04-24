import Image from 'next/image'
import Link from 'next/link'

export default function OfflinePage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(214,248,236,0.95)_0%,_rgba(248,251,255,1)_40%,_rgba(255,247,237,1)_100%)] text-slate-900 dark:bg-[radial-gradient(circle_at_0%_0%,_#121212_0%,_#1e1e1e_56%,_#212121_100%)] dark:text-white">
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
        <p className="max-w-md text-sm text-slate-600 dark:text-slate-300">
          EduMart is running in app mode. Check your internet connection and retry to continue shopping.
        </p>
        <Link
          href="/"
          className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-blue-900 dark:hover:bg-blue-800"
        >
          Retry Home
        </Link>
      </section>
    </main>
  )
}
