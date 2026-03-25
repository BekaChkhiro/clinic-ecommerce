import { sdk } from "@lib/config"
import { getCacheOptions } from "./cookies"

export type CmsPage = {
  id: string
  slug: string
  title_ka: string
  title_en: string | null
  content_ka: string
  content_en: string | null
  meta_title_ka: string | null
  meta_title_en: string | null
  meta_description_ka: string | null
  meta_description_en: string | null
  sort_order: number
}

export const listPages = async () => {
  const next = {
    ...(await getCacheOptions("pages")),
  }

  return sdk.client
    .fetch<{ pages: CmsPage[] }>("/store/pages", {
      next,
      cache: "force-cache",
    })
    .then(({ pages }) => pages)
    .catch(() => [] as CmsPage[])
}

export const getPageBySlug = async (slug: string) => {
  const next = {
    ...(await getCacheOptions("pages")),
  }

  return sdk.client
    .fetch<{ page: CmsPage }>(`/store/pages/${slug}`, {
      next,
      cache: "force-cache",
    })
    .then(({ page }) => page)
    .catch(() => null)
}
