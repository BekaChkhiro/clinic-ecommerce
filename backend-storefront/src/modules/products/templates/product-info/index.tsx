import { HttpTypes } from "@medusajs/types"
import { ProductExtension } from "@lib/data/product-extension"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
  extension: ProductExtension | null
  locale: string
}

const ProductInfo = ({ product, extension, locale }: ProductInfoProps) => {
  const isKa = locale === "ka"

  const title =
    isKa && extension?.name_ka
      ? extension.name_ka
      : extension?.name_en || product.title

  const description =
    isKa && extension?.description_ka
      ? extension.description_ka
      : extension?.description_en || product.description

  const country = extension?.manufacturer_country
  const weight = extension?.weight
  const unit = extension?.unit

  return (
    <div id="product-info">
      <div className="flex flex-col gap-y-3">
        {/* Brand / Collection */}
        {product.collection && (
          <LocalizedClientLink
            href={`/collections/${product.collection.handle}`}
            className="text-xs font-medium uppercase tracking-wider text-brand-red hover:text-brand-red-dark transition-colors"
          >
            {product.collection.title}
          </LocalizedClientLink>
        )}

        {/* Title */}
        <h1
          className="text-2xl small:text-3xl font-bold text-gray-900 leading-tight"
          data-testid="product-title"
        >
          {title}
        </h1>

        {/* Attributes */}
        {(country || weight) && (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
            {country && (
              <span className="flex items-center gap-x-1.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
                {country}
              </span>
            )}
            {weight && (
              <span className="flex items-center gap-x-1.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 0 1-2.031.352 5.988 5.988 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971Zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 0 1-2.031.352 5.989 5.989 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971Z" />
                </svg>
                {weight}{unit ? ` ${unit}` : ""}
              </span>
            )}
          </div>
        )}

        {/* Description */}
        {description && (
          <p
            className="text-sm text-gray-600 leading-relaxed mt-1"
            data-testid="product-description"
          >
            {description}
          </p>
        )}
      </div>
    </div>
  )
}

export default ProductInfo
