import { sdk } from "@lib/config"
import { getCacheOptions } from "./cookies"

export type Banner = {
  id: string
  title_ka: string | null
  title_en: string | null
  subtitle_ka: string | null
  subtitle_en: string | null
  image: string
  image_mobile: string | null
  link: string | null
  button_text_ka: string | null
  button_text_en: string | null
  position: "homepage" | "category" | "product"
  sort_order: number
}

export const listBanners = async (position?: string) => {
  const next = {
    ...(await getCacheOptions("banners")),
  }

  return sdk.client
    .fetch<{ banners: Banner[] }>("/store/banners", {
      query: position ? { position } : {},
      next,
      cache: "force-cache",
    })
    .then(({ banners }) => banners)
}
