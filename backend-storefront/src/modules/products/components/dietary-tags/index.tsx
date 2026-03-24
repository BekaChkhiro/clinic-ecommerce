"use client"

import { ProductExtension } from "@lib/data/product-extension"
import { useTranslations } from "next-intl"

type DietaryTagsProps = {
  extension: ProductExtension
  locale: string
}

const tagConfig = [
  { key: "is_sugar_free" as const, translationKey: "sugarFree", color: "bg-green-100 text-green-800 border-green-200" },
  { key: "is_low_protein" as const, translationKey: "lowProtein", color: "bg-blue-100 text-blue-800 border-blue-200" },
  { key: "is_diabetic_friendly" as const, translationKey: "diabeticFriendly", color: "bg-purple-100 text-purple-800 border-purple-200" },
  { key: "is_gluten_free" as const, translationKey: "glutenFree", color: "bg-orange-100 text-orange-800 border-orange-200" },
] as const

export default function DietaryTags({ extension }: DietaryTagsProps) {
  const t = useTranslations("product.tags")

  const activeTags = tagConfig.filter((tag) => extension[tag.key])

  if (activeTags.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2">
      {activeTags.map((tag) => (
        <span
          key={tag.key}
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${tag.color}`}
        >
          {t(tag.translationKey)}
        </span>
      ))}
    </div>
  )
}
