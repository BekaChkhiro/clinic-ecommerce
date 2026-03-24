"use server"

import { sdk } from "@lib/config"
import { getCacheOptions } from "./cookies"
import {
  locales as configLocales,
  localeNames,
} from "../../i18n/config"

export type Locale = {
  code: string
  name: string
}

/** Static fallback derived from i18n config */
const FALLBACK_LOCALES: Locale[] = configLocales.map((code) => ({
  code,
  name: localeNames[code],
}))

/**
 * Fetches available locales from the backend.
 * Falls back to static config if the endpoint is unavailable.
 */
export const listLocales = async (): Promise<Locale[]> => {
  const next = {
    ...(await getCacheOptions("locales")),
  }

  return sdk.client
    .fetch<{ locales: Locale[] }>(`/store/locales`, {
      method: "GET",
      next,
      cache: "force-cache",
    })
    .then(({ locales }) => (locales?.length ? locales : FALLBACK_LOCALES))
    .catch(() => FALLBACK_LOCALES)
}
