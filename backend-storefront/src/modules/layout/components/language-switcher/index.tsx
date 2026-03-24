"use client"

import { useRouter } from "next/navigation"
import { useLocale } from "next-intl"
import { useTransition } from "react"

import { updateLocale } from "@lib/data/locale-actions"
import { localeNames, locales, type Locale } from "../../../../i18n/config"

/**
 * Compact inline language switcher for the header.
 * Shows "KA | EN" style toggle buttons.
 */
const LanguageSwitcher = () => {
  const currentLocale = useLocale() as Locale
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleSwitch = (locale: Locale) => {
    if (locale === currentLocale) return
    startTransition(async () => {
      await updateLocale(locale)
      router.refresh()
    })
  }

  return (
    <div className="flex items-center gap-x-1 text-xs font-medium">
      {locales.map((locale, i) => (
        <span key={locale} className="flex items-center">
          {i > 0 && <span className="text-ui-fg-muted mx-1">|</span>}
          <button
            onClick={() => handleSwitch(locale)}
            disabled={isPending}
            className={`px-1 py-0.5 rounded transition-colors ${
              locale === currentLocale
                ? "text-ui-fg-base font-semibold"
                : "text-ui-fg-muted hover:text-ui-fg-base"
            } ${isPending ? "opacity-50" : ""}`}
          >
            {locale.toUpperCase()}
          </button>
        </span>
      ))}
    </div>
  )
}

export default LanguageSwitcher
