import { HttpTypes } from "@medusajs/types"
import { ProductExtension } from "@lib/data/product-extension"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { getTranslations } from "next-intl/server"

type BreadcrumbsProps = {
  product: HttpTypes.StoreProduct
  extension: ProductExtension | null
  locale: string
}

export default async function Breadcrumbs({
  product,
  extension,
  locale,
}: BreadcrumbsProps) {
  const t = await getTranslations()

  const productName =
    locale === "ka" && extension?.name_ka
      ? extension.name_ka
      : extension?.name_en || product.title

  const category = product.categories?.[0]

  return (
    <nav aria-label="Breadcrumb" className="text-sm text-ui-fg-muted">
      <ol className="flex items-center gap-x-1.5 flex-wrap">
        <li>
          <LocalizedClientLink href="/" className="hover:text-ui-fg-base transition-colors">
            {t("common.home")}
          </LocalizedClientLink>
        </li>
        <li className="text-ui-fg-muted">/</li>
        <li>
          <LocalizedClientLink href="/store" className="hover:text-ui-fg-base transition-colors">
            {t("common.products")}
          </LocalizedClientLink>
        </li>
        {category && (
          <>
            <li className="text-ui-fg-muted">/</li>
            <li>
              <LocalizedClientLink
                href={`/categories/${category.handle}`}
                className="hover:text-ui-fg-base transition-colors"
              >
                {category.name}
              </LocalizedClientLink>
            </li>
          </>
        )}
        <li className="text-ui-fg-muted">/</li>
        <li className="text-ui-fg-base font-medium truncate max-w-[200px]">
          {productName}
        </li>
      </ol>
    </nav>
  )
}
