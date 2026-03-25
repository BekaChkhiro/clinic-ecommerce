"use client"

import { HttpTypes } from "@medusajs/types"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useTranslations } from "next-intl"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import { getWishlistProduct } from "@lib/data/wishlist"

export default function WishlistProductCard({
  productId,
  onRemove,
}: {
  productId: string
  onRemove: () => void
}) {
  const t = useTranslations("wishlist")
  const { countryCode } = useParams()
  const [product, setProduct] = useState<HttpTypes.StoreProduct | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getWishlistProduct(productId, countryCode as string)
      .then((p) => setProduct(p))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false))
  }, [productId, countryCode])

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="bg-ui-bg-subtle aspect-[3/4] w-full rounded" />
        <div className="mt-4 h-4 bg-ui-bg-subtle rounded w-3/4" />
        <div className="mt-2 h-4 bg-ui-bg-subtle rounded w-1/2" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="relative border border-ui-border-base rounded p-4 text-center">
        <p className="text-ui-fg-muted text-sm">{t("productUnavailable")}</p>
        <button
          onClick={onRemove}
          className="mt-2 text-sm text-brand-red hover:underline"
        >
          {t("remove")}
        </button>
      </div>
    )
  }

  return (
    <div className="group relative" data-testid="wishlist-product-card">
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white border border-ui-border-base hover:bg-ui-bg-base-hover transition-colors"
        aria-label={t("remove")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-4 h-4 text-ui-fg-muted"
        >
          <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
        </svg>
      </button>
      <LocalizedClientLink href={`/products/${product.handle}`}>
        <Thumbnail
          thumbnail={product.thumbnail}
          images={product.images}
          size="full"
        />
        <div className="flex flex-col mt-4">
          <span className="text-ui-fg-subtle txt-compact-medium">
            {product.title}
          </span>
          {(() => {
            const calcPrice = product.variants?.[0]?.calculated_price
            if (!calcPrice) return null
            return (
              <span className="text-ui-fg-base txt-compact-medium font-semibold mt-1">
                {new Intl.NumberFormat(undefined, {
                  style: "currency",
                  currency: calcPrice.currency_code ?? "GEL",
                }).format((calcPrice.calculated_amount ?? 0) / 100)}
              </span>
            )
          })()}
        </div>
      </LocalizedClientLink>
    </div>
  )
}
