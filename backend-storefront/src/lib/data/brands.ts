"use server"

import { sdk } from "@lib/config"
import { getCacheOptions } from "./cookies"

export type StoreBrand = {
  id: string
  name_ka: string
  name_en: string | null
  slug: string
  country: string | null
  logo: string | null
  sort_order: number
}

export const listBrands = async (): Promise<StoreBrand[]> => {
  const next = {
    ...(await getCacheOptions("brands")),
  }

  return sdk.client
    .fetch<{ brands: StoreBrand[] }>("/store/brands", {
      next,
      cache: "force-cache",
    })
    .then(({ brands }) => brands)
}
