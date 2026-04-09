export default function VendorDashboardPage() {
  return (
    <section>
      <h2 className="brand-title text-3xl tracking-tight">Vendor Dashboard</h2>
      <p className="mt-2 text-sm text-slate-600">Product management, fulfillment, and analytics will live here.</p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {['Products', 'Inventory', 'Orders'].map((item) => (
          <div key={item} className="brand-card p-6">
            <p className="text-sm font-medium text-slate-500">{item}</p>
            <p className="mt-4 text-2xl font-semibold text-slate-900">Coming next</p>
          </div>
        ))}
      </div>
    </section>
  );
}
