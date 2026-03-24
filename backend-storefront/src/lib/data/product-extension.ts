"use server"

import { sdk } from "@lib/config"
import { getCacheOptions } from "./cookies"

export type ProductExtension = {
  id: string
  name_ka: string
  name_en?: string
  description_ka?: string
  description_en?: string
  is_sugar_free: boolean
  is_low_protein: boolean
  is_diabetic_friendly: boolean
  is_gluten_free: boolean
  product_type: "SUPPLEMENT" | "SPECIAL_FOOD" | "MEDICATION" | "COSMETIC" | "DEVICE" | "OTHER"
  manufacturer_country?: string
  weight?: string
  unit?: string
  apex_id?: string
  meta_title_ka?: string
  meta_title_en?: string
  meta_description_ka?: string
  meta_description_en?: string
}

export async function getProductExtension(
  productId: string
): Promise<ProductExtension | null> {
  try {
    const next = {
      ...(await getCacheOptions("product-extension")),
    }

    const data = await sdk.client.fetch<{
      product_extension: ProductExtension | null
    }>(`/store/products/${productId}/extension`, {
      method: "GET",
      next,
      cache: "force-cache",
    })

    return data.product_extension
  } catch {
    return null
  }
}
