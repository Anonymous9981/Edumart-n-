import { UserRole } from '@edumart/shared'

import { requireRole } from '../../../lib/require-role'
import AdminDashboardClient from './admin-dashboard-client'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  await requireRole([UserRole.ADMIN], '/dashboard/admin')
  return <AdminDashboardClient />
}
