"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"

export type SortOptions = "price_asc" | "price_desc" | "created_at"

export default function SortDropdown({ sortBy }: { sortBy: SortOptions }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const t = useTranslations("store")

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams)
    params.set("sortBy", value)
    params.delete("page")
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="relative">
      <select
        value={sortBy}
        onChange={(e) => handleChange(e.target.value)}
        className="appearance-none bg-white border border-gray-200 rounded-xl pl-4 pr-10 py-2.5 text-sm font-medium text-gray-700 cursor-pointer hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all shadow-sm"
      >
        <option value="created_at">{t("sortLatest")}</option>
        <option value="price_asc">{t("sortPriceAsc")}</option>
        <option value="price_desc">{t("sortPriceDesc")}</option>
      </select>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </div>
  )
}
