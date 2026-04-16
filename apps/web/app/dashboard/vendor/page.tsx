import { UserRole } from '@edumart/shared'
import { prisma } from '../../../lib/prisma'
import { requireRole } from '../../../lib/require-role'

export const dynamic = 'force-dynamic'

async function getVendorSnapshot() {
  try {
    const [vendorCount, approvedVendorCount, productCount, aggregateStock] = await Promise.all([
      prisma.vendorProfile.count({ where: { deletedAt: null } }),
      prisma.vendorProfile.count({ where: { verificationStatus: 'APPROVED', deletedAt: null } }),
      prisma.product.count({ where: { status: 'ACTIVE', deletedAt: null } }),
      prisma.product.aggregate({
        where: { status: 'ACTIVE', deletedAt: null },
        _sum: { stock: true },
      }),
    ])

    return {
      vendorCount,
      approvedVendorCount,
      productCount,
      stock: aggregateStock._sum.stock ?? 0,
    }
  } catch {
    return { vendorCount: 0, approvedVendorCount: 0, productCount: 0, stock: 0 }
  }
}

export default async function VendorDashboardPage() {
  await requireRole([UserRole.VENDOR], '/dashboard/vendor')
  const snapshot = await getVendorSnapshot()

  return (
    <section>
      <h2 className="brand-title text-3xl tracking-tight">Vendor Dashboard</h2>
      <p className="mt-2 text-sm text-slate-600">Product management and fulfillment metrics are now database-driven.</p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="brand-card p-6">
          <p className="text-sm font-medium text-slate-500">Approved vendors</p>
          <p className="mt-4 text-2xl font-semibold text-slate-900">{snapshot.approvedVendorCount.toLocaleString('en-IN')}</p>
          <p className="mt-2 text-sm text-slate-600">of {snapshot.vendorCount.toLocaleString('en-IN')} total vendors</p>
        </div>
        <div className="brand-card p-6">
          <p className="text-sm font-medium text-slate-500">Active products</p>
          <p className="mt-4 text-2xl font-semibold text-slate-900">{snapshot.productCount.toLocaleString('en-IN')}</p>
          <p className="mt-2 text-sm text-slate-600">currently visible in marketplace</p>
        </div>
        <div className="brand-card p-6">
          <p className="text-sm font-medium text-slate-500">Aggregate stock</p>
          <p className="mt-4 text-2xl font-semibold text-slate-900">{snapshot.stock.toLocaleString('en-IN')}</p>
          <p className="mt-2 text-sm text-slate-600">units available in active listings</p>
        </div>
      </div>
    </section>
  );
}
