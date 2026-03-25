"use server"

import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { getAuthHeaders, getCacheOptions } from "./cookies"
import { getRegion } from "./regions"

export async function getWishlistProduct(
  productId: string,
  countryCode: string
): Promise<HttpTypes.StoreProduct | null> {
  const region = await getRegion(countryCode)
  if (!region) return null

  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("products")),
  }

  try {
    const { products } = await sdk.client.fetch<{
      products: HttpTypes.StoreProduct[]
    }>(`/store/products`, {
      method: "GET",
      query: {
        id: [productId],
        region_id: region.id,
        fields:
          "*variants.calculated_price,+variants.inventory_quantity,*variants.images,+metadata,+tags,",
        limit: 1,
      },
      headers,
      next,
      cache: "force-cache",
    })

    return products[0] ?? null
  } catch {
    return null
  }
}
