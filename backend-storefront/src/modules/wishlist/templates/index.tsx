"use client"

import { useWishlist } from "@lib/context/wishlist-context"
import { useTranslations } from "next-intl"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import WishlistProductCard from "../components/wishlist-product-card"

export default function WishlistTemplate() {
  const { items, removeItem } = useWishlist()
  const t = useTranslations("wishlist")

  return (
    <div className="content-container py-6">
      <h1 className="text-2xl font-semibold mb-6">{t("title")}</h1>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="w-16 h-16 text-ui-fg-muted mb-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={1}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
          <p className="text-ui-fg-muted text-lg mb-2">{t("emptyTitle")}</p>
          <p className="text-ui-fg-subtle mb-6">{t("emptyDescription")}</p>
          <LocalizedClientLink
            href="/store"
            className="bg-brand-red text-white px-6 py-2 rounded hover:bg-brand-red-dark transition-colors"
          >
            {t("browseProducts")}
          </LocalizedClientLink>
        </div>
      ) : (
        <>
          <p className="text-ui-fg-subtle mb-4">
            {t("itemCount", { count: items.length })}
          </p>
          <div className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-4 gap-x-6 gap-y-8">
            {items.map((productId) => (
              <WishlistProductCard
                key={productId}
                productId={productId}
                onRemove={() => removeItem(productId)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
