import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="brand-page">
      <div className="mx-auto grid min-h-screen max-w-7xl lg:grid-cols-[280px_1fr]">
        <aside className="px-6 py-8 text-white" style={{ background: 'linear-gradient(180deg, #0b3558 0%, #14507e 60%, #0f172a 100%)' }}>
          <div>
            <p className="brand-kicker">EduMart</p>
            <h1 className="mt-3 text-2xl font-semibold">Dashboard</h1>
            <p className="mt-2 text-sm text-slate-300">Protected role-based workspace</p>
          </div>
          <nav className="mt-10 space-y-2 text-sm">
            <Link className="brand-nav-link brand-nav-link-active" href="/dashboard/customer">Customer</Link>
            <Link className="brand-nav-link" href="/dashboard/vendor">Vendor</Link>
            <Link className="brand-nav-link" href="/dashboard/admin">Admin</Link>
            <Link className="brand-btn-accent mt-3 block px-4 py-3 text-center" href="/logout">Sign out</Link>
          </nav>
        </aside>
        <main className="p-6 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
