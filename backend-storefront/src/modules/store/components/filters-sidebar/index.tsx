"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useState, useTransition } from "react"
import { useTranslations } from "next-intl"
import { clx } from "@medusajs/ui"

type Category = {
  id: string
  name_ka: string
  name_en: string | null
  slug: string
  parent_id: string | null
}

type Brand = {
  id: string
  name_ka: string
  name_en: string | null
  slug: string
}

type FiltersSidebarProps = {
  categories: Category[]
  brands: Brand[]
  locale: string
  activeCategory?: string
  activeBrand?: string
  dietaryFilters?: string[]
  inStockOnly?: boolean
  searchQuery?: string
}

export default function FiltersSidebar({
  categories,
  brands,
  locale,
  activeCategory,
  activeBrand,
  dietaryFilters = [],
  inStockOnly = false,
  searchQuery = "",
}: FiltersSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [search, setSearch] = useState(searchQuery)
  const [mobileOpen, setMobileOpen] = useState(false)
  const t = useTranslations("store")

  const getName = (item: { name_ka: string; name_en: string | null }) =>
    locale === "ka" ? item.name_ka : (item.name_en || item.name_ka)

  const createQueryString = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams)
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "") {
          params.delete(key)
        } else {
          params.set(key, value)
        }
      })
      params.delete("page")
      return params.toString()
    },
    [searchParams]
  )

  const setFilter = (updates: Record<string, string | null>) => {
    startTransition(() => {
      const query = createQueryString(updates)
      router.push(`${pathname}${query ? `?${query}` : ""}`)
    })
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setFilter({ q: search || null })
  }

  const toggleDietary = (tag: string) => {
    const current = new Set(dietaryFilters)
    if (current.has(tag)) {
      current.delete(tag)
    } else {
      current.add(tag)
    }
    const value = Array.from(current).join(",")
    setFilter({ dietary: value || null })
  }

  const clearAll = () => {
    setSearch("")
    startTransition(() => {
      const params = new URLSearchParams()
      const sortBy = searchParams.get("sortBy")
      if (sortBy) params.set("sortBy", sortBy)
      router.push(`${pathname}${params.toString() ? `?${params}` : ""}`)
    })
  }

  const hasActiveFilters =
    activeCategory || activeBrand || dietaryFilters.length > 0 || inStockOnly || searchQuery

  const topCategories = categories
    .filter((c) => !c.parent_id)
    .sort((a, b) => (a as any).sort_order - (b as any).sort_order)

  const filterContent = (
    <div className="flex flex-col gap-y-6">
      {/* Search */}
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("searchProducts")}
          className="w-full border border-ui-border-base rounded-lg px-4 py-2.5 text-sm bg-ui-bg-field focus:outline-none focus:border-brand-red transition-colors"
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-ui-fg-muted hover:text-brand-red"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </button>
      </form>

      {/* Clear filters */}
      {hasActiveFilters && (
        <button
          onClick={clearAll}
          className="text-sm text-brand-red hover:text-brand-red-dark underline text-left"
        >
          {t("clearFilters")}
        </button>
      )}

      {/* Categories */}
      <div>
        <h3 className="text-sm font-semibold text-ui-fg-base mb-3">
          {t("categories")}
        </h3>
        <ul className="flex flex-col gap-y-1.5">
          <li>
            <button
              onClick={() => setFilter({ category: null })}
              className={clx(
                "text-sm hover:text-brand-red transition-colors w-full text-left py-0.5",
                !activeCategory
                  ? "text-brand-red font-medium"
                  : "text-ui-fg-subtle"
              )}
            >
              {t("allCategories")}
            </button>
          </li>
          {topCategories.map((cat) => (
            <li key={cat.id}>
              <button
                onClick={() =>
                  setFilter({
                    category: activeCategory === cat.slug ? null : cat.slug,
                  })
                }
                className={clx(
                  "text-sm hover:text-brand-red transition-colors w-full text-left py-0.5",
                  activeCategory === cat.slug
                    ? "text-brand-red font-medium"
                    : "text-ui-fg-subtle"
                )}
              >
                {getName(cat)}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Brands */}
      <div>
        <h3 className="text-sm font-semibold text-ui-fg-base mb-3">
          {t("brands")}
        </h3>
        <ul className="flex flex-col gap-y-1.5 max-h-[200px] overflow-y-auto">
          <li>
            <button
              onClick={() => setFilter({ brand: null })}
              className={clx(
                "text-sm hover:text-brand-red transition-colors w-full text-left py-0.5",
                !activeBrand
                  ? "text-brand-red font-medium"
                  : "text-ui-fg-subtle"
              )}
            >
              {t("allBrands")}
            </button>
          </li>
          {brands.map((brand) => (
            <li key={brand.id}>
              <button
                onClick={() =>
                  setFilter({
                    brand: activeBrand === brand.slug ? null : brand.slug,
                  })
                }
                className={clx(
                  "text-sm hover:text-brand-red transition-colors w-full text-left py-0.5",
                  activeBrand === brand.slug
                    ? "text-brand-red font-medium"
                    : "text-ui-fg-subtle"
                )}
              >
                {getName(brand)}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Dietary Filters */}
      <div>
        <h3 className="text-sm font-semibold text-ui-fg-base mb-3">
          {t("dietaryFilters")}
        </h3>
        <div className="flex flex-col gap-y-2">
          {(
            [
              { key: "sugar_free", label: t("sugarFree") },
              { key: "low_protein", label: t("lowProtein") },
              { key: "diabetic_friendly", label: t("diabeticFriendly") },
              { key: "gluten_free", label: t("glutenFree") },
            ] as const
          ).map(({ key, label }) => (
            <label
              key={key}
              className="flex items-center gap-x-2.5 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={dietaryFilters.includes(key)}
                onChange={() => toggleDietary(key)}
                className="w-4 h-4 rounded border-ui-border-base text-brand-red focus:ring-brand-red accent-brand-red"
              />
              <span className="text-sm text-ui-fg-subtle group-hover:text-ui-fg-base transition-colors">
                {label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* In Stock */}
      <div>
        <label className="flex items-center gap-x-2.5 cursor-pointer group">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={() => setFilter({ inStock: inStockOnly ? null : "true" })}
            className="w-4 h-4 rounded border-ui-border-base text-brand-red focus:ring-brand-red accent-brand-red"
          />
          <span className="text-sm text-ui-fg-subtle group-hover:text-ui-fg-base font-medium transition-colors">
            {t("inStockOnly")}
          </span>
        </label>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile filter toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="small:hidden flex items-center gap-x-2 text-sm font-medium text-ui-fg-base mb-4 px-4"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="4" x2="4" y1="21" y2="14" /><line x1="4" x2="4" y1="10" y2="3" /><line x1="12" x2="12" y1="21" y2="12" /><line x1="12" x2="12" y1="8" y2="3" /><line x1="20" x2="20" y1="21" y2="16" /><line x1="20" x2="20" y1="12" y2="3" /><line x1="2" x2="6" y1="14" y2="14" /><line x1="10" x2="14" y1="8" y2="8" /><line x1="18" x2="22" y1="16" y2="16" />
        </svg>
        {t("filters")}
        {hasActiveFilters && (
          <span className="bg-brand-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {[activeCategory, activeBrand, ...dietaryFilters, inStockOnly ? "s" : ""].filter(Boolean).length}
          </span>
        )}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 small:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-[300px] bg-white p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">{t("filters")}</h2>
              <button
                onClick={() => setMobileOpen(false)}
                className="text-ui-fg-muted hover:text-ui-fg-base"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                </svg>
              </button>
            </div>
            {filterContent}
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside
        className={clx(
          "hidden small:block small:min-w-[250px] small:max-w-[250px] small:pr-8 small:sticky small:top-24",
          isPending && "opacity-60 pointer-events-none"
        )}
      >
        {filterContent}
      </aside>
    </>
  )
}
