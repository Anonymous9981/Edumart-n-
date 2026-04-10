export default function Loading() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(214,248,236,0.95)_0%,_rgba(248,251,255,1)_40%,_rgba(255,247,237,1)_100%)]">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center gap-4 px-4">
        <img
          src="/brand/karom-edumart-loader.webp"
          alt="Karom EduMart"
          className="h-36 w-36 rounded-3xl border border-amber-200 bg-white p-2 object-contain shadow-xl"
        />
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-600">Loading marketplace</p>
        <div className="h-2 w-44 overflow-hidden rounded-full bg-slate-200">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-[#0B3558]" />
        </div>
      </div>
    </main>
  )
}
