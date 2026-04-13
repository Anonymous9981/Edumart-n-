"use client"

import { useMemo, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import type { HomepageProduct } from "../lib/homepage-types"
import { ProductCard } from "./ui/product-card"
import { useRealtimeRefresh } from "../lib/supabase/realtime"

export interface ShopSubcategory {
  id: string
  name: string
  slug: string
  description?: string | null
  image?: string | null
}

export interface ShopCategory {
  id: string
  name: string
  slug: string
  description?: string | null
  image?: string | null
  subcategories: ShopSubcategory[]
}

interface ShopCatalogProps {
  products: HomepageProduct[]
  categories: ShopCategory[]
}

const FALLBACK_CATEGORY_IMAGE =
  "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1200&q=80"

export function ShopCatalog({ products, categories }: ShopCatalogProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const initialCategory = searchParams.get("category") ?? categories[0]?.slug ?? "all"
  const initialSubcategory = searchParams.get("subcategory") ?? "all"

  const [activeCategorySlug, setActiveCategorySlug] = useState<string>(initialCategory)
  const [activeSubcategorySlug, setActiveSubcategorySlug] = useState<string>(initialSubcategory)
  const realtimeTables = useMemo(
    () => [
      { table: 'Product' as const },
      { table: 'Category' as const },
      { table: 'VendorProfile' as const },
    ],
    [],
  )

  useRealtimeRefresh(
    'edumart-shop-live-refresh',
    realtimeTables,
    () => router.refresh(),
    true,
  )

  function updateQuery(categorySlug: string, subcategorySlug: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.set("category", categorySlug)
    if (subcategorySlug !== "all") {
      params.set("subcategory", subcategorySlug)
    } else {
      params.delete("subcategory")
    }
    router.replace(`${pathname}?${params.toString()}`)
  }

  const activeCategory = useMemo(
    () => categories.find((category) => category.slug === activeCategorySlug) ?? categories[0],
    [activeCategorySlug, categories],
  )

  const activeSubcategory = useMemo(
    () => activeCategory?.subcategories.find((subcategory) => subcategory.slug === activeSubcategorySlug),
    [activeCategory, activeSubcategorySlug],
  )

  const visibleProducts = useMemo(() => {
    if (!activeCategory) {
      return products
    }

    const allowedCategories = new Set<string>([activeCategory.name])
    activeCategory.subcategories.forEach((subcategory) => allowedCategories.add(subcategory.name))

    if (activeSubcategory) {
      return products.filter((product) => {
        const productSubcategory = product.subcategory?.toLowerCase()
        if (productSubcategory) {
          return productSubcategory === activeSubcategory.name.toLowerCase()
        }
        return product.category.toLowerCase() === activeSubcategory.name.toLowerCase()
      })
    }

    const filtered = products.filter((product) => allowedCategories.has(product.subcategory ?? product.category))
    return filtered.length > 0 ? filtered : products
  }, [activeCategory, activeSubcategory, products])

  const activeSubcategories = activeCategory?.subcategories ?? []

  return (
    <div className="space-y-5">
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="grid gap-4 p-5 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Filter products</p>
            <h2 className="mt-2 text-3xl font-extrabold text-slate-900">Find categories and subcategories without clutter</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Use the category rail to narrow the catalog, then select a subcategory chip to get a focused product grid instantly.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-1">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Category</p>
              <p className="mt-1 text-base font-extrabold text-slate-900">{activeCategory?.name || 'All products'}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Subcategory</p>
              <p className="mt-1 text-base font-extrabold text-slate-900">{activeSubcategory?.name || 'All subcategories'}</p>
            </div>
            <div className="rounded-2xl bg-[#0B3558] p-4 text-white">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/70">Visible products</p>
              <p className="mt-1 text-2xl font-extrabold">{visibleProducts.length.toLocaleString('en-IN')}</p>
              <p className="text-xs font-semibold text-white/80">matched to the current filter</p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">Categories</p>
            <p className="mt-1 text-sm text-slate-600">Select one category and the subcategory row updates below.</p>
          </div>
          <button
            type="button"
            onClick={() => {
              const first = categories[0]
              if (!first) return
              setActiveCategorySlug(first.slug)
              setActiveSubcategorySlug('all')
              updateQuery(first.slug, 'all')
            }}
            className="rounded-full border border-slate-300 px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
          >
            Reset filters
          </button>
        </div>

        <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1">
          {categories.map((category) => {
            const active = category.slug === activeCategorySlug
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => {
                  setActiveCategorySlug(category.slug)
                  setActiveSubcategorySlug('all')
                  updateQuery(category.slug, 'all')
                }}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition ${
                  active ? 'text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
                style={active ? { backgroundColor: '#0B3558' } : undefined}
              >
                {category.name}
              </button>
            )
          })}
        </div>

        {activeSubcategories.length ? (
          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">Subcategories</p>
                <p className="mt-1 text-sm text-slate-600">Refine the selected category without leaving the page.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!activeCategory) return
                  setActiveSubcategorySlug('all')
                  updateQuery(activeCategory.slug, 'all')
                }}
                className={`rounded-full px-3 py-2 text-xs font-bold transition ${
                  activeSubcategorySlug === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                All
              </button>
            </div>

            <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
              {activeSubcategories.map((subcategory) => (
                <button
                  key={subcategory.id}
                  type="button"
                  onClick={() => {
                    if (!activeCategory) return
                    setActiveSubcategorySlug(subcategory.slug)
                    updateQuery(activeCategory.slug, subcategory.slug)
                  }}
                  className={`shrink-0 rounded-full px-3 py-2 text-xs font-bold transition ${
                    activeSubcategorySlug === subcategory.slug
                      ? 'bg-[#0B3558] text-white'
                      : 'bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {subcategory.name}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">Results</p>
            <h3 className="mt-1 text-2xl font-extrabold text-slate-900">
              {activeSubcategory ? activeSubcategory.name : activeCategory?.name || 'All products'}
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              {activeSubcategory?.description || activeCategory?.description || 'Browse products tailored to your selected category.'}
            </p>
          </div>
          <p className="text-sm font-semibold text-slate-500">{visibleProducts.length.toLocaleString('en-IN')} items visible</p>
        </div>

        <div className="mt-4 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {visibleProducts.length ? (
            visibleProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                detailHref={`/product/${product.slug}`}
                priceLabel={`₹${product.finalPrice.toLocaleString('en-IN')}`}
                originalPriceLabel={`₹${product.price.toLocaleString('en-IN')}`}
                discountLabel={
                  product.discountType === 'FIXED'
                    ? `₹${product.discountValue?.toLocaleString('en-IN')} OFF`
                    : `${product.discountPercentage}% OFF`
                }
                actionLabel="Open Product"
                secondaryActionLabel="Save"
                metaLabel={product.audience === 'student' ? 'Student product' : 'School product'}
              />
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600 sm:col-span-2 xl:col-span-3">
              No products found for this combination. Try another subcategory.
            </div>
          )}
        </div>
      </section>
    </div>
  )
}