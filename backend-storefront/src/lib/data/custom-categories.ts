import { sdk } from "@lib/config"
import { getCacheOptions } from "./cookies"

export type CustomCategory = {
  id: string
  name_ka: string
  name_en: string | null
  slug: string
  description_ka: string | null
  description_en: string | null
  image: string | null
  parent_id: string | null
  sort_order: number
}

export const listCustomCategories = async (parentId?: string) => {
  const next = {
    ...(await getCacheOptions("categories")),
  }

  const query: Record<string, string> = {}
  if (parentId) {
    query.parent_id = parentId
  }

  return sdk.client
    .fetch<{ categories: CustomCategory[] }>("/store/categories", {
      query,
      next,
      cache: "force-cache",
    })
    .then(({ categories }) => categories)
}
