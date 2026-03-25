import { Suspense } from "react"
import { getTranslations } from "next-intl/server"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import FiltersSidebar from "@modules/store/components/filters-sidebar"
import SortDropdown, {
  SortOptions,
} from "@modules/store/components/sort-dropdown"
import { listBrands } from "@lib/data/brands"
import { listCustomCategories } from "@lib/data/custom-categories"
import { getLocale } from "@lib/data/locale-actions"

import PaginatedProducts from "./paginated-products"

export type StoreFilters = {
  sortBy?: SortOptions
  page?: string
  category?: string
  brand?: string
  dietary?: string
  inStock?: string
  q?: string
}

const StoreTemplate = async ({
  sortBy,
  page,
  countryCode,
  filters,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
  filters?: StoreFilters
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"
  const locale = (await getLocale()) || "ka"

  const [categories, brands, t] = await Promise.all([
    listCustomCategories(),
    listBrands(),
    getTranslations("store"),
  ])

  const dietaryFilters = filters?.dietary?.split(",").filter(Boolean) || []

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Hero Banner */}
      <div className="bg-white border-b border-gray-100">
        <div className="content-container py-10 small:py-14">
          <div className="flex flex-col small:flex-row small:items-end small:justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red mb-3">
                {t("allProducts")}
              </p>
              <h1
                className="text-3xl small:text-4xl font-bold text-gray-900 tracking-tight"
                data-testid="store-page-title"
              >
                {locale === "ka" ? "მაღაზია" : "Shop"}
              </h1>
              <div className="mt-2 w-12 h-1 bg-brand-red rounded-full" />
            </div>
            <div className="flex items-center gap-3">
              <SortDropdown sortBy={sort} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="content-container py-8">
        <div className="flex flex-col small:flex-row small:items-start gap-8">
          <FiltersSidebar
            categories={categories}
            brands={brands}
            locale={locale}
            activeCategory={filters?.category}
            activeBrand={filters?.brand}
            dietaryFilters={dietaryFilters}
            inStockOnly={filters?.inStock === "true"}
            searchQuery={filters?.q}
          />

          <div className="w-full min-w-0">
            <Suspense fallback={<SkeletonProductGrid />}>
              <PaginatedProducts
                sortBy={sort}
                page={pageNumber}
                countryCode={countryCode}
                filters={filters}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StoreTemplate
