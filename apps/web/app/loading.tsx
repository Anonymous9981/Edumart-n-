export default function Loading() {
  return (
    <main className="min-h-screen brand-page px-4 py-5 sm:px-6 lg:py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="brand-panel overflow-hidden p-5 sm:p-6">
          <div className="grid gap-5 md:grid-cols-[1.15fr_0.85fr] md:items-center">
            <div className="space-y-3">
              <div className="brand-skeleton h-4 w-32" />
              <div className="brand-skeleton h-10 w-full max-w-lg" />
              <div className="brand-skeleton h-5 w-full max-w-xl" />
              <div className="flex gap-2 pt-1">
                <div className="brand-skeleton h-10 w-32" />
                <div className="brand-skeleton h-10 w-28" />
              </div>
            </div>
            <div className="brand-skeleton h-48 w-full rounded-3xl" />
          </div>
        </div>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <article key={index} className="brand-card overflow-hidden p-3">
              <div className="brand-skeleton h-44 w-full rounded-2xl" />
              <div className="mt-3 space-y-2">
                <div className="brand-skeleton h-3 w-24" />
                <div className="brand-skeleton h-5 w-full" />
                <div className="brand-skeleton h-5 w-2/3" />
                <div className="brand-skeleton h-4 w-28" />
              </div>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <div className="brand-skeleton h-10 w-full" />
                <div className="brand-skeleton h-10 w-full" />
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  )
}
