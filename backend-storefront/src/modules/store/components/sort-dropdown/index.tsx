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
    <select
      value={sortBy}
      onChange={(e) => handleChange(e.target.value)}
      className="border border-ui-border-base rounded-lg px-3 py-2 text-sm bg-ui-bg-field focus:outline-none focus:border-brand-red cursor-pointer"
    >
      <option value="created_at">{t("sortLatest")}</option>
      <option value="price_asc">{t("sortPriceAsc")}</option>
      <option value="price_desc">{t("sortPriceDesc")}</option>
    </select>
  )
}
