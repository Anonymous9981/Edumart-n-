import { redirect } from 'next/navigation'

import { getDashboardPathForRole } from '../../constants/roles'
import { requireRole } from '../../lib/require-role'
import { UserRole } from '@edumart/shared'

export const dynamic = 'force-dynamic'

export default async function DashboardHomePage() {
  const user = await requireRole([UserRole.CUSTOMER, UserRole.VENDOR, UserRole.ADMIN], '/dashboard')
  redirect(getDashboardPathForRole(user.role))
}
