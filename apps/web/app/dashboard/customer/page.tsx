import Link from 'next/link'
import { UserRole } from '@edumart/shared'
import { OrderStatus } from '@prisma/client'
import { prisma } from '../../../lib/prisma'
import { requireRole } from '../../../lib/require-role'

export const dynamic = 'force-dynamic'

async function getCustomerSnapshot(userId: string) {
  try {
    const [orderCount, wishlistCount, cartCount, currentOrders, recentOrders] = await Promise.all([
      prisma.order.count({ where: { userId, deletedAt: null } }),
      prisma.wishlistItem.count({ where: { userId } }),
      prisma.cartItem.count({ where: { OR: [{ userId }, { cart: { userId } }] } }),
      prisma.order.findMany({
        where: {
          userId,
          deletedAt: null,
          status: {
            in: [OrderStatus.PENDING, OrderStatus.CONFIRMED, OrderStatus.SHIPPED],
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 4,
        select: {
          id: true,
          orderNumber: true,
          status: true,
          finalAmount: true,
          createdAt: true,
        },
      }),
      prisma.order.findMany({
        where: { userId, deletedAt: null },
        orderBy: { createdAt: 'desc' },
        take: 6,
        select: {
          id: true,
          orderNumber: true,
          status: true,
          finalAmount: true,
          createdAt: true,
        },
      }),
    ])

    return { orderCount, wishlistCount, cartCount, currentOrders, recentOrders }
  } catch {
    return { orderCount: 0, wishlistCount: 0, cartCount: 0, currentOrders: [], recentOrders: [] }
  }
}

export default async function CustomerDashboardPage() {
  const user = await requireRole([UserRole.CUSTOMER], '/dashboard/customer')
  const snapshot = await getCustomerSnapshot(user.id)

  return (
    <section>
      <h2 className="brand-title text-3xl tracking-tight">Customer Dashboard</h2>
      <p className="mt-2 text-sm text-slate-600">Active session, wishlist, cart, and order visibility for your account.</p>
      <div className="mt-6 brand-card p-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Account session</p>
        <p className="mt-2 text-lg font-extrabold text-slate-900">{user.firstName || user.lastName ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() : 'Customer Account'}</p>
        <p className="mt-1 text-sm text-slate-600">{user.email}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/dashboard/profile" className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-bold text-slate-700">Profile</Link>
          <Link href="/wishlist" className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-bold text-slate-700">Wishlist</Link>
          <Link href="/cart" className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-bold text-slate-700">Cart</Link>
          <Link href="/logout" className="rounded-lg bg-[#0B3558] px-3 py-2 text-xs font-bold text-white">Logout</Link>
        </div>
      </div>
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
          ['Current Orders', '/dashboard/customer'],
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

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <div className="brand-card p-5">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Current orders</p>
          {snapshot.currentOrders.length ? (
            <div className="mt-3 space-y-3">
              {snapshot.currentOrders.map((order) => (
                <div key={order.id} className="rounded-xl border border-slate-200 px-3 py-3">
                  <p className="text-sm font-bold text-slate-900">{order.orderNumber}</p>
                  <p className="text-xs text-slate-600">{order.status} • ₹{order.finalAmount.toLocaleString('en-IN')}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-slate-600">No active orders right now.</p>
          )}
        </div>

        <div className="brand-card p-5">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Recent orders</p>
          {snapshot.recentOrders.length ? (
            <div className="mt-3 space-y-3">
              {snapshot.recentOrders.map((order) => (
                <div key={order.id} className="rounded-xl border border-slate-200 px-3 py-3">
                  <p className="text-sm font-bold text-slate-900">{order.orderNumber}</p>
                  <p className="text-xs text-slate-600">{order.status} • ₹{order.finalAmount.toLocaleString('en-IN')}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-slate-600">No order history yet.</p>
          )}
        </div>
      </div>
    </section>
  )
}
