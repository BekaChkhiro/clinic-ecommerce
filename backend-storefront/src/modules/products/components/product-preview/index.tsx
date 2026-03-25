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

  return (
    <LocalizedClientLink href={`/products/${product.handle}`} className="group">
      <div data-testid="product-wrapper">
        <div className="relative">
          <Thumbnail
            thumbnail={product.thumbnail}
            images={product.images}
            size="full"
            isFeatured={isFeatured}
          />
          <div className="absolute top-2 right-2 z-10">
            <WishlistButton productId={product.id!} size="sm" />
          </div>
          {/* Hover "Add to Cart" hint */}
          <div className="absolute bottom-0 left-0 right-0 bg-brand-red text-white text-center text-xs font-medium py-2.5 rounded-b-large opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            + Add to Cart
          </div>
        </div>
        <div className="mt-3 flex flex-col gap-y-1">
          <h3
            className="text-sm font-medium text-gray-900 line-clamp-2 leading-snug"
            data-testid="product-title"
          >
            {product.title}
          </h3>
          <div className="flex items-center gap-x-2">
            {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}
