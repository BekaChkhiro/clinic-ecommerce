"use client"

import { ProductExtension } from "@lib/data/product-extension"
import { useTranslations } from "next-intl"

type ProductDisclaimerProps = {
  extension: ProductExtension
  locale: string
}

const disclaimerMap: Record<string, string> = {
  SUPPLEMENT: "supplement",
  SPECIAL_FOOD: "specialFood",
  MEDICATION: "medication",
}

export default function ProductDisclaimer({ extension }: ProductDisclaimerProps) {
  const t = useTranslations("disclaimers")

  const disclaimerKey = disclaimerMap[extension.product_type]
  if (!disclaimerKey) return null

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-900">
      <div className="flex items-start gap-2">
        <span className="text-amber-600 mt-0.5 flex-shrink-0">⚠</span>
        <p className="leading-relaxed">{t(disclaimerKey)}</p>
      </div>
    </div>
  )
}
