export const locales = ["ka", "en"] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = "ka"

export const localeNames: Record<Locale, string> = {
  ka: "ქართული",
  en: "English",
}
