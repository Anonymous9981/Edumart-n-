import Link from 'next/link'
import { UserRole } from '@edumart/shared'
import { prisma } from '../../../lib/prisma'
import { requireRole } from '../../../lib/require-role'

export const dynamic = 'force-dynamic'

async function getCustomerSnapshot() {
  try {
    const [orderCount, wishlistCount, cartCount] = await Promise.all([
      prisma.order.count({ where: { deletedAt: null } }),
      prisma.wishlistItem.count(),
      prisma.cartItem.count(),
    ])

    return { orderCount, wishlistCount, cartCount }
  } catch {
    return { orderCount: 0, wishlistCount: 0, cartCount: 0 }
  }
}

export default async function CustomerDashboardPage() {
  await requireRole([UserRole.CUSTOMER], '/dashboard/customer')
  const snapshot = await getCustomerSnapshot()

  return (
    <section>
      <h2 className="brand-title text-3xl tracking-tight">Customer Dashboard</h2>
      <p className="mt-2 text-sm text-slate-600">Orders, wishlist and cart metrics are rendered from live database values.</p>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="brand-card p-5">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Orders</p>
          <p className="mt-2 text-3xl font-extrabold text-slate-900">{snapshot.orderCount.toLocaleString('en-IN')}</p>
        </div>
        <div className="brand-card p-5">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Wishlist items</p>
          <p className="mt-2 text-3xl font-extrabold text-slate-900">{snapshot.wishlistCount.toLocaleString('en-IN')}</p>
        </div>
        <div className="brand-card p-5">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Cart items</p>
          <p className="mt-2 text-3xl font-extrabold text-slate-900">{snapshot.cartCount.toLocaleString('en-IN')}</p>
        </div>
      </div>
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
