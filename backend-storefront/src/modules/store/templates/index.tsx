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
  const productCount = 0 // Will be updated by PaginatedProducts

  return (
    <div className="py-6 content-container">
      {/* Header */}
      <div className="flex flex-col small:flex-row small:items-center small:justify-between mb-6 px-4 small:px-0">
        <h1 className="text-2xl font-semibold text-ui-fg-base" data-testid="store-page-title">
          {t("allProducts")}
        </h1>
        <div className="flex items-center gap-x-4 mt-3 small:mt-0">
          <SortDropdown sortBy={sort} />
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col small:flex-row small:items-start">
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

        <div className="w-full px-4 small:px-0">
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
  )
}

export default StoreTemplate
