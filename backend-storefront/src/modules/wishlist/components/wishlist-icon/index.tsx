"use client"

import { useWishlist } from "@lib/context/wishlist-context"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useTranslations } from "next-intl"

export default function WishlistIcon() {
  const { count } = useWishlist()
  const t = useTranslations("wishlist")

  return (
    <LocalizedClientLink
      href="/wishlist"
      className="flex items-center justify-center w-10 h-10 rounded-lg text-gray-600 hover:text-brand-red hover:bg-red-50/50 transition-all duration-200 relative"
      data-testid="nav-wishlist-link"
      title={t("title")}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="w-[22px] h-[22px]"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 bg-brand-red text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
          {count}
        </span>
      )}
    </LocalizedClientLink>
  )
}
