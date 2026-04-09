export default function ProductLoading() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(214,248,236,0.95)_0%,_rgba(248,251,255,1)_40%,_rgba(255,247,237,1)_100%)] px-4 py-6 text-slate-900 sm:px-6 lg:py-10">
      <div className="mx-auto max-w-7xl animate-pulse space-y-6">
        <div className="h-64 rounded-[2rem] bg-white/80 shadow-sm" />
        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-4">
            <div className="h-96 rounded-[2rem] bg-white/80 shadow-sm" />
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="h-24 rounded-2xl bg-white/80" />
              <div className="h-24 rounded-2xl bg-white/80" />
              <div className="h-24 rounded-2xl bg-white/80" />
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-72 rounded-[2rem] bg-white/80 shadow-sm" />
            <div className="h-40 rounded-[2rem] bg-white/80 shadow-sm" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-80 rounded-3xl bg-white/80 shadow-sm" />
          ))}
        </div>
      </div>
    </main>
  )
}