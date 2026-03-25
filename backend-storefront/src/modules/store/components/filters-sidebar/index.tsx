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
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    categories: true,
    brands: true,
    dietary: true,
  })
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

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const hasActiveFilters =
    activeCategory || activeBrand || dietaryFilters.length > 0 || inStockOnly || searchQuery

  const activeFilterCount = [
    activeCategory,
    activeBrand,
    ...dietaryFilters,
    inStockOnly ? "s" : "",
  ].filter(Boolean).length

  const topCategories = categories
    .filter((c) => !c.parent_id)
    .sort((a, b) => (a as any).sort_order - (b as any).sort_order)

  const SectionHeader = ({
    title,
    section,
    count,
  }: {
    title: string
    section: string
    count?: number
  }) => (
    <button
      onClick={() => toggleSection(section)}
      className="flex items-center justify-between w-full py-2 group/section"
    >
      <h3 className="text-xs font-bold uppercase tracking-[0.1em] text-gray-900">
        {title}
        {count !== undefined && count > 0 && (
          <span className="ml-2 text-[10px] bg-brand-red text-white rounded-full px-1.5 py-0.5 font-semibold">
            {count}
          </span>
        )}
      </h3>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={clx(
          "text-gray-400 transition-transform duration-200",
          expandedSections[section] ? "rotate-180" : ""
        )}
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>
  )

  const filterContent = (
    <div className="flex flex-col gap-y-1">
      {/* Search */}
      <form onSubmit={handleSearch} className="relative mb-4">
        <div className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("searchProducts")}
            className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all"
          />
        </div>
      </form>

      {/* Active Filters Badge & Clear */}
      {hasActiveFilters && (
        <button
          onClick={clearAll}
          className="flex items-center gap-2 text-xs font-medium text-brand-red hover:text-brand-red-dark mb-3 py-1.5 px-3 rounded-lg bg-red-50 hover:bg-red-100 transition-colors self-start"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18" /><path d="m6 6 12 12" />
          </svg>
          {t("clearFilters")}
        </button>
      )}

      {/* Categories */}
      <div className="border-b border-gray-100 pb-2">
        <SectionHeader
          title={t("categories")}
          section="categories"
          count={activeCategory ? 1 : 0}
        />
        {expandedSections.categories && (
          <ul className="flex flex-col gap-y-0.5 mt-1 mb-2">
            <li>
              <button
                onClick={() => setFilter({ category: null })}
                className={clx(
                  "text-sm w-full text-left py-1.5 px-3 rounded-lg transition-all duration-150",
                  !activeCategory
                    ? "bg-brand-red/10 text-brand-red font-semibold"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
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
                    "text-sm w-full text-left py-1.5 px-3 rounded-lg transition-all duration-150",
                    activeCategory === cat.slug
                      ? "bg-brand-red/10 text-brand-red font-semibold"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  {getName(cat)}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Brands */}
      <div className="border-b border-gray-100 pb-2">
        <SectionHeader
          title={t("brands")}
          section="brands"
          count={activeBrand ? 1 : 0}
        />
        {expandedSections.brands && (
          <ul className="flex flex-col gap-y-0.5 mt-1 mb-2 max-h-[220px] overflow-y-auto scrollbar-thin">
            <li>
              <button
                onClick={() => setFilter({ brand: null })}
                className={clx(
                  "text-sm w-full text-left py-1.5 px-3 rounded-lg transition-all duration-150",
                  !activeBrand
                    ? "bg-brand-red/10 text-brand-red font-semibold"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
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
                    "text-sm w-full text-left py-1.5 px-3 rounded-lg transition-all duration-150",
                    activeBrand === brand.slug
                      ? "bg-brand-red/10 text-brand-red font-semibold"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  {getName(brand)}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Dietary Filters */}
      <div className="border-b border-gray-100 pb-2">
        <SectionHeader
          title={t("dietaryFilters")}
          section="dietary"
          count={dietaryFilters.length}
        />
        {expandedSections.dietary && (
          <div className="flex flex-col gap-y-1 mt-1 mb-2">
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
                className={clx(
                  "flex items-center gap-3 cursor-pointer py-1.5 px-3 rounded-lg transition-all duration-150",
                  dietaryFilters.includes(key)
                    ? "bg-brand-red/10"
                    : "hover:bg-gray-50"
                )}
              >
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={dietaryFilters.includes(key)}
                    onChange={() => toggleDietary(key)}
                    className="peer sr-only"
                  />
                  <div className="w-4.5 h-4.5 w-[18px] h-[18px] rounded border-2 border-gray-300 peer-checked:border-brand-red peer-checked:bg-brand-red transition-all duration-150 flex items-center justify-center">
                    {dietaryFilters.includes(key) && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className={clx(
                  "text-sm transition-colors",
                  dietaryFilters.includes(key)
                    ? "text-gray-900 font-medium"
                    : "text-gray-600"
                )}>
                  {label}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* In Stock */}
      <div className="pt-1">
        <label
          className={clx(
            "flex items-center gap-3 cursor-pointer py-2 px-3 rounded-lg transition-all duration-150",
            inStockOnly ? "bg-emerald-50" : "hover:bg-gray-50"
          )}
        >
          <div className="relative flex items-center">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={() => setFilter({ inStock: inStockOnly ? null : "true" })}
              className="peer sr-only"
            />
            <div className="w-[18px] h-[18px] rounded border-2 border-gray-300 peer-checked:border-emerald-500 peer-checked:bg-emerald-500 transition-all duration-150 flex items-center justify-center">
              {inStockOnly && (
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
          </div>
          <span className={clx(
            "text-sm font-medium transition-colors",
            inStockOnly ? "text-emerald-700" : "text-gray-600"
          )}>
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
        className="small:hidden flex items-center gap-2.5 text-sm font-semibold text-gray-900 mb-4 py-2.5 px-5 rounded-xl bg-white border border-gray-200 shadow-sm active:scale-[0.98] transition-transform"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="4" x2="4" y1="21" y2="14" /><line x1="4" x2="4" y1="10" y2="3" /><line x1="12" x2="12" y1="21" y2="12" /><line x1="12" x2="12" y1="8" y2="3" /><line x1="20" x2="20" y1="21" y2="16" /><line x1="20" x2="20" y1="12" y2="3" /><line x1="2" x2="6" y1="14" y2="14" /><line x1="10" x2="14" y1="8" y2="8" /><line x1="18" x2="22" y1="16" y2="16" />
        </svg>
        {t("filters")}
        {activeFilterCount > 0 && (
          <span className="bg-brand-red text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 small:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-[320px] bg-white shadow-2xl overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center z-10">
              <h2 className="text-base font-bold text-gray-900">{t("filters")}</h2>
              <button
                onClick={() => setMobileOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              {filterContent}
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside
        className={clx(
          "hidden small:block small:min-w-[260px] small:max-w-[260px] small:sticky small:top-24 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 h-fit",
          isPending && "opacity-50 pointer-events-none"
        )}
      >
        {filterContent}
      </aside>
    </>
  )
}
