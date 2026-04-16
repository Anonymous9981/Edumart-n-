import { UserRole } from '@edumart/shared';
import { getDashboardPathForRole, ROLE_LABELS } from '../../constants/roles';
import { DashboardNav } from '../../components/dashboard-nav';
import { requireRole } from '../../lib/require-role';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole([UserRole.CUSTOMER, UserRole.VENDOR, UserRole.ADMIN], '/dashboard')
  const dashboardPath = getDashboardPathForRole(user.role)
  const fullName = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || 'Account User'
  const initials = fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('') || 'U'

  return (
    <div className="brand-page">
      <div className="mx-auto grid min-h-screen max-w-7xl lg:grid-cols-[280px_1fr]">
        <aside className="px-6 py-8 text-white" style={{ background: 'linear-gradient(180deg, #0b3558 0%, #14507e 60%, #0f172a 100%)' }}>
          <div>
            <p className="brand-kicker">EduMart</p>
            <h1 className="mt-3 text-2xl font-semibold">Dashboard</h1>
            <p className="mt-2 text-sm text-slate-300">{ROLE_LABELS[user.role]} workspace</p>
            <div className="mt-5 flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-3 py-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/90 text-sm font-black text-[#0b3558]">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">{fullName}</p>
                <p className="truncate text-xs uppercase tracking-[0.12em] text-slate-300">{user.email}</p>
              </div>
            </div>
          </div>
          <DashboardNav dashboardPath={dashboardPath} dashboardLabel={ROLE_LABELS[user.role]} />
        </aside>
        <main className="p-6 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
