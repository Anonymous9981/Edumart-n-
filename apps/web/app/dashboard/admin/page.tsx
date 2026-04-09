'use client';

import { useMemo, useState } from 'react';

type StockFilter = 'all' | 'in-stock' | 'low-stock' | 'out-of-stock';

const INVENTORY = [
  { name: 'Class 10 Success Pack', vendor: 'EduMart School Store', stock: 42, threshold: 12 },
  { name: 'Interactive Flat Panel', vendor: 'EduMart School Solutions', stock: 6, threshold: 10 },
  { name: 'Plantorium Event Kit', vendor: 'EduMart School Solutions', stock: 0, threshold: 8 },
  { name: 'Maths Workbook Set', vendor: 'EduMart School Store', stock: 18, threshold: 10 },
  { name: 'Teacher Desk Organiser', vendor: 'Campus Supply Co.', stock: 0, threshold: 5 },
  { name: 'Coding Starter Kit', vendor: 'TechForSchools', stock: 14, threshold: 8 },
];

function getStatus(stock: number, threshold: number) {
  if (stock <= 0) {
    return 'out-of-stock';
  }

  if (stock <= threshold) {
    return 'low-stock';
  }

  return 'in-stock';
}

export default function AdminDashboardPage() {
  const [filter, setFilter] = useState<StockFilter>('all');

  const filteredInventory = useMemo(() => {
    return INVENTORY.filter((item) => filter === 'all' || getStatus(item.stock, item.threshold) === filter);
  }, [filter]);

  const totalItems = INVENTORY.length;
  const outOfStock = INVENTORY.filter((item) => getStatus(item.stock, item.threshold) === 'out-of-stock').length;
  const lowStock = INVENTORY.filter((item) => getStatus(item.stock, item.threshold) === 'low-stock').length;
  const readyStock = INVENTORY.filter((item) => getStatus(item.stock, item.threshold) === 'in-stock').length;

  return (
    <section className="space-y-6">
      <div>
        <h2 className="brand-title text-3xl tracking-tight">Admin Dashboard</h2>
        <p className="mt-2 text-sm text-slate-600">Inventory moderation, out-of-stock filtering, approvals, and audit controls live here.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          ['Total Items', totalItems.toString(), 'Catalog items tracked'],
          ['In Stock', readyStock.toString(), 'Ready for fulfillment'],
          ['Low Stock', lowStock.toString(), 'Needs replenishment'],
          ['Out of Stock', outOfStock.toString(), 'Hidden from featured listings'],
        ].map(([label, value, note]) => (
          <div key={label} className="brand-card p-5">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{label}</p>
            <p className="mt-3 text-3xl font-extrabold text-slate-900">{value}</p>
            <p className="mt-2 text-sm text-slate-600">{note}</p>
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">Stock filter</h3>
            <p className="mt-1 text-sm text-slate-600">Use this view to hide or review products that are out of stock.</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              ['all', 'All'],
              ['in-stock', 'In stock'],
              ['low-stock', 'Low stock'],
              ['out-of-stock', 'Out of stock'],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value as StockFilter)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${filter === value ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 grid gap-3">
          {filteredInventory.map((item) => {
            const status = getStatus(item.stock, item.threshold);
            const statusLabel = status === 'out-of-stock' ? 'Out of stock' : status === 'low-stock' ? 'Low stock' : 'In stock';
            const statusClasses =
              status === 'out-of-stock'
                ? 'bg-red-50 text-red-700 border-red-200'
                : status === 'low-stock'
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200';

            return (
              <article key={item.name} className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.16em] text-slate-500">{item.vendor}</p>
                  <h4 className="mt-1 text-lg font-extrabold text-slate-900">{item.name}</h4>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <span className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] ${statusClasses}`}>
                    {statusLabel}
                  </span>
                  <div className="rounded-xl bg-white px-4 py-2 text-sm text-slate-700 shadow-sm">
                    Stock: <span className="font-extrabold text-slate-900">{item.stock}</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
