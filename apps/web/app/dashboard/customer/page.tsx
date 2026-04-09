import Link from 'next/link'

export default function CustomerDashboardPage() {
  return (
    <section>
      <h2 className="brand-title text-3xl tracking-tight">Customer Dashboard</h2>
      <p className="mt-2 text-sm text-slate-600">Orders, wishlist, cart, addresses, and checkout history are connected below.</p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {[
          ['Orders', '/dashboard/customer'],
          ['Wishlist', '/wishlist'],
          ['Cart', '/cart'],
        ].map(([item, href]) => (
          <Link key={item} href={href} className="brand-card block p-6 transition hover:-translate-y-1">
            <p className="text-sm font-medium text-slate-500">{item}</p>
            <p className="mt-4 text-2xl font-semibold text-slate-900">Open page</p>
            <p className="mt-2 text-sm text-slate-600">View the connected experience for {item.toLowerCase()}.</p>
          </Link>
        ))}
      </div>
    </section>
  )
}
