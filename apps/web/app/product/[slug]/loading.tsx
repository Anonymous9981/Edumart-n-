export default function ProductLoading() {
  return (
    <main className="min-h-screen brand-page px-4 py-6 text-slate-900 sm:px-6 lg:py-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="brand-skeleton h-64 rounded-[2rem]" />
        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-4">
            <div className="brand-skeleton h-96 rounded-[2rem]" />
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="brand-skeleton h-24 rounded-2xl" />
              <div className="brand-skeleton h-24 rounded-2xl" />
              <div className="brand-skeleton h-24 rounded-2xl" />
            </div>
          </div>
          <div className="space-y-4">
            <div className="brand-skeleton h-72 rounded-[2rem]" />
            <div className="brand-skeleton h-40 rounded-[2rem]" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="brand-skeleton h-80 rounded-3xl" />
          ))}
        </div>
      </div>
    </main>
  )
}