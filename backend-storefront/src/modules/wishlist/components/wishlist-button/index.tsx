"use client"

import { useWishlist } from "@lib/context/wishlist-context"
import { useTranslations } from "next-intl"

export default function WishlistButton({
  productId,
  size = "md",
}: {
  productId: string
  size?: "sm" | "md"
}) {
  const { toggleItem, hasItem } = useWishlist()
  const t = useTranslations("wishlist")
  const isWished = hasItem(productId)

  const sizeClasses = size === "sm" ? "w-8 h-8" : "w-10 h-10"
  const iconSize = size === "sm" ? "w-4 h-4" : "w-5 h-5"

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggleItem(productId)
      }}
      className={`${sizeClasses} flex items-center justify-center rounded-full border border-ui-border-base bg-white hover:bg-ui-bg-base-hover transition-colors`}
      aria-label={isWished ? t("removeFromWishlist") : t("addToWishlist")}
      data-testid="wishlist-button"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className={`${iconSize} transition-colors`}
        fill={isWished ? "#A90000" : "none"}
        stroke={isWished ? "#A90000" : "currentColor"}
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>
    </button>
  )
}
