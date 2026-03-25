import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"
import WishlistButton from "@modules/wishlist/components/wishlist-button"

export default async function ProductPreview({
  product,
  isFeatured,
  region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  const { cheapestPrice } = getProductPrice({
    product,
  })

  const isNew = product.created_at
    ? Date.now() - new Date(product.created_at).getTime() < 14 * 24 * 60 * 60 * 1000
    : false

  const isSale = cheapestPrice?.price_type === "sale"

  return (
    <LocalizedClientLink href={`/products/${product.handle}`} className="group block">
      <div
        className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 ease-out"
        data-testid="product-wrapper"
      >
        {/* Image Container */}
        <div className="relative overflow-hidden">
          <Thumbnail
            thumbnail={product.thumbnail}
            images={product.images}
            size="full"
            isFeatured={isFeatured}
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {isNew && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500 text-white shadow-sm">
                New
              </span>
            )}
            {isSale && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-red text-white shadow-sm">
                Sale
              </span>
            )}
          </div>

          {/* Wishlist */}
          <div className="absolute top-3 right-3 z-10">
            <WishlistButton productId={product.id!} size="sm" />
          </div>

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />

          {/* Quick View Bar */}
          <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
            <div className="bg-gray-900/90 backdrop-blur-sm text-white text-center text-xs font-semibold tracking-wide uppercase py-3">
              View Details
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3
            className="text-sm font-medium text-gray-800 line-clamp-2 leading-snug group-hover:text-gray-900 transition-colors"
            data-testid="product-title"
          >
            {product.title}
          </h3>
          <div className="mt-2 flex items-center gap-2">
            {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}
