import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

// GET /store/banners - List active banners (public)
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const filters: Record<string, unknown> = {
    is_active: true,
  }

  // Optional: filter by position (homepage, category, product)
  if (req.query.position) {
    filters.position = req.query.position as string
  }

  const { data } = await query.graph({
    entity: "banner",
    fields: [
      "id",
      "title_ka",
      "title_en",
      "subtitle_ka",
      "subtitle_en",
      "image",
      "image_mobile",
      "link",
      "button_text_ka",
      "button_text_en",
      "position",
      "starts_at",
      "ends_at",
      "sort_order",
    ],
    filters,
  })

  // Filter by scheduling: only return banners that are currently active
  const now = new Date()
  const banners = data
    .filter((banner: any) => {
      if (banner.starts_at && new Date(banner.starts_at) > now) return false
      if (banner.ends_at && new Date(banner.ends_at) < now) return false
      return true
    })
    .sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0))

  res.json({ banners })
}
