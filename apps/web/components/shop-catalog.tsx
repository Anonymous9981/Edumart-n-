"use client"

import { useMemo, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import type { HomepageProduct } from "../lib/homepage-types"
import { ProductCard } from "./ui/product-card"

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
      return products.filter((product) => product.category.toLowerCase() === activeSubcategory.name.toLowerCase())
    }

    const filtered = products.filter((product) => allowedCategories.has(product.category))
    return filtered.length > 0 ? filtered : products
  }, [activeCategory, activeSubcategory, products])

  const panelImage =
    activeSubcategory?.image ??
    activeCategory?.image ??
    visibleProducts[0]?.image ??
    FALLBACK_CATEGORY_IMAGE

  return (
    <div className="grid gap-5 lg:grid-cols-[0.75fr_1.25fr]">
      <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-extrabold text-slate-900">Categories</h2>
        <p className="mt-1 text-sm text-slate-600">Select category and subcategory to focus catalog results.</p>

        <div className="mt-4 space-y-3">
          {categories.map((category) => {
            const active = category.slug === activeCategorySlug
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => {
                  setActiveCategorySlug(category.slug)
                  setActiveSubcategorySlug("all")
                  updateQuery(category.slug, "all")
                }}
                className={`w-full rounded-2xl border p-4 text-left transition ${
                  active
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-slate-50 text-slate-900 hover:bg-slate-100"
                }`}
              >
                <p className="font-bold">{category.name}</p>
                <p className={`mt-1 text-sm leading-6 ${active ? "text-slate-100" : "text-slate-600"}`}>
                  {category.description || "Explore products in this category."}
                </p>
              </button>
            )
          })}
        </div>

        {activeCategory?.subcategories.length ? (
          <div className="mt-5">
            <h3 className="text-sm font-extrabold uppercase tracking-[0.15em] text-slate-500">Subcategories</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setActiveSubcategorySlug("all")
                  updateQuery(activeCategory.slug, "all")
                }}
                className={`rounded-full px-3 py-2 text-xs font-bold transition ${
                  activeSubcategorySlug === "all" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                All
              </button>
              {activeCategory.subcategories.map((subcategory) => (
                <button
                  key={subcategory.id}
                  type="button"
                  onClick={() => {
                    setActiveSubcategorySlug(subcategory.slug)
                    updateQuery(activeCategory.slug, subcategory.slug)
                  }}
                  className={`rounded-full px-3 py-2 text-xs font-bold transition ${
                    activeSubcategorySlug === subcategory.slug
                      ? "bg-[#0B3558] text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {subcategory.name}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </aside>

      <div className="space-y-5">
        <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="grid gap-4 p-4 sm:p-5 md:grid-cols-[1fr_1.2fr] md:items-center">
            <img
              src={panelImage}
              alt={activeSubcategory ? activeSubcategory.name : activeCategory?.name || "Category"}
              className="h-44 w-full rounded-2xl object-cover"
            />
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Now viewing</p>
              <h3 className="mt-2 text-2xl font-extrabold text-slate-900">
                {activeSubcategory ? activeSubcategory.name : activeCategory?.name || "All Products"}
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                {activeSubcategory?.description || activeCategory?.description || "Browse products tailored to your selected category."}
              </p>
            </div>
          </div>
        </article>

        {activeCategory?.subcategories.length ? (
          <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <h4 className="text-sm font-extrabold uppercase tracking-[0.15em] text-slate-500">Subcategory media cards</h4>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {activeCategory.subcategories.map((subcategory) => (
                <button
                  key={subcategory.id}
                  type="button"
                  onClick={() => {
                    setActiveSubcategorySlug(subcategory.slug)
                    updateQuery(activeCategory.slug, subcategory.slug)
                  }}
                  className={`overflow-hidden rounded-2xl border text-left transition ${
                    activeSubcategorySlug === subcategory.slug
                      ? "border-[#0B3558] ring-2 ring-[#0B3558]/20"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <img
                    src={subcategory.image ?? panelImage}
                    alt={subcategory.name}
                    className="h-28 w-full object-cover"
                  />
                  <div className="p-3">
                    <p className="text-sm font-extrabold text-slate-900">{subcategory.name}</p>
                    <p className="mt-1 text-xs text-slate-600">{subcategory.description || "Open this subcategory"}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        ) : null}

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {visibleProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              detailHref={`/product/${product.slug}`}
              priceLabel={`₹${product.finalPrice.toLocaleString("en-IN")}`}
              originalPriceLabel={`₹${product.price.toLocaleString("en-IN")}`}
              discountLabel={
                product.discountType === "FIXED"
                  ? `₹${product.discountValue?.toLocaleString("en-IN")} OFF`
                  : `${product.discountPercentage}% OFF`
              }
              actionLabel="Open Product"
              secondaryActionLabel="Save"
              metaLabel={product.audience === "student" ? "Student product" : "School product"}
            />
          ))}
        </div>
      </div>
    </div>
  )
}