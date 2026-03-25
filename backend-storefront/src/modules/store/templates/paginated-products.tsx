import { getTranslations } from "next-intl/server"
import { listProductsWithSort } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import ProductPreview from "@modules/products/components/product-preview"
import { Pagination } from "@modules/store/components/pagination"
import { SortOptions } from "@modules/store/components/sort-dropdown"
import { StoreFilters } from "./index"

const PRODUCT_LIMIT = 12

type PaginatedProductsParams = {
  limit: number
  collection_id?: string[]
  category_id?: string[]
  id?: string[]
  order?: string
  q?: string
}

export default async function PaginatedProducts({
  sortBy,
  page,
  collectionId,
  categoryId,
  productsIds,
  countryCode,
  filters,
}: {
  sortBy?: SortOptions
  page: number
  collectionId?: string
  categoryId?: string
  productsIds?: string[]
  countryCode: string
  filters?: StoreFilters
}) {
  const t = await getTranslations("store")

  const queryParams: PaginatedProductsParams = {
    limit: 12,
  }

  if (collectionId) {
    queryParams["collection_id"] = [collectionId]
  }

  if (categoryId) {
    queryParams["category_id"] = [categoryId]
  }

  if (productsIds) {
    queryParams["id"] = productsIds
  }

  // Search query
  if (filters?.q) {
    queryParams["q"] = filters.q
  }

  if (sortBy === "created_at") {
    queryParams["order"] = "created_at"
  }

  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  let {
    response: { products, count },
  } = await listProductsWithSort({
    page,
    queryParams,
    sortBy,
    countryCode,
  })

  // Client-side filtering for custom fields (metadata-based)
  if (filters?.dietary) {
    const tags = filters.dietary.split(",").filter(Boolean)
    const tagToMetaKey: Record<string, string> = {
      sugar_free: "is_sugar_free",
      low_protein: "is_low_protein",
      diabetic_friendly: "is_diabetic_friendly",
      gluten_free: "is_gluten_free",
    }

    products = products.filter((p) => {
      const meta = (p.metadata || {}) as Record<string, any>
      return tags.every((tag) => {
        const key = tagToMetaKey[tag]
        return key && meta[key] === true
      })
    })
    count = products.length
  }

  // Filter by stock availability
  if (filters?.inStock === "true") {
    products = products.filter((p) =>
      p.variants?.some(
        (v) =>
          v.inventory_quantity != null && v.inventory_quantity > 0
      )
    )
    count = products.length
  }

  const totalPages = Math.ceil(count / PRODUCT_LIMIT)

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
          </svg>
        </div>
        <p className="text-lg font-semibold text-gray-900 mb-2">
          {t("noProducts")}
        </p>
        <p className="text-sm text-gray-500 max-w-sm">
          {t("noProductsHint")}
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500">
          {t("showingResults", { count })}
        </p>
      </div>
      <ul
        className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-4 gap-4 small:gap-6"
        data-testid="products-list"
      >
        {products.map((p) => {
          return (
            <li key={p.id}>
              <ProductPreview product={p} region={region} />
            </li>
          )
        })}
      </ul>
      {totalPages > 1 && (
        <Pagination
          data-testid="product-pagination"
          page={page}
          totalPages={totalPages}
        />
      )}
    </>
  )
}
