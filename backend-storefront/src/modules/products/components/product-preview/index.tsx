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

  const isSale = cheapestPrice?.price_type === "sale"

  return (
    <LocalizedClientLink href={`/products/${product.handle}`} className="group block">
      <div data-testid="product-wrapper">
        {/* Image */}
        <div className="relative overflow-hidden rounded-xl bg-gray-50">
          <Thumbnail
            thumbnail={product.thumbnail}
            images={product.images}
            size="full"
            isFeatured={isFeatured}
          />

          {/* Sale badge */}
          {isSale && (
            <span className="absolute top-2.5 left-2.5 z-10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide bg-brand-red text-white rounded-md">
              Sale
            </span>
          )}

          {/* Wishlist */}
          <div className="absolute top-2.5 right-2.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <WishlistButton productId={product.id!} size="sm" />
          </div>
        </div>

        {/* Info */}
        <div className="pt-3 space-y-1">
          <h3
            className="text-[13px] text-gray-700 line-clamp-2 leading-snug group-hover:text-gray-900 transition-colors duration-200"
            data-testid="product-title"
          >
            {product.title}
          </h3>
          {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
        </div>
      </div>
    </LocalizedClientLink>
  )
}
