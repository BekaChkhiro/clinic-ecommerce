import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"
import { ProductExtension } from "@lib/data/product-extension"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
  extension: ProductExtension | null
  locale: string
}

const ProductInfo = ({ product, extension, locale }: ProductInfoProps) => {
  const title =
    locale === "ka" && extension?.name_ka
      ? extension.name_ka
      : extension?.name_en || product.title

  const description =
    locale === "ka" && extension?.description_ka
      ? extension.description_ka
      : extension?.description_en || product.description

  return (
    <div id="product-info">
      <div className="flex flex-col gap-y-4 mx-auto">
        {product.collection && (
          <LocalizedClientLink
            href={`/collections/${product.collection.handle}`}
            className="text-medium text-ui-fg-muted hover:text-ui-fg-subtle"
          >
            {product.collection.title}
          </LocalizedClientLink>
        )}
        <Heading
          level="h1"
          className="text-2xl small:text-3xl leading-10 text-ui-fg-base"
          data-testid="product-title"
        >
          {title}
        </Heading>

        {description && (
          <Text
            className="text-medium text-ui-fg-subtle whitespace-pre-line"
            data-testid="product-description"
          >
            {description}
          </Text>
        )}
      </div>
    </div>
  )
}

export default ProductInfo
