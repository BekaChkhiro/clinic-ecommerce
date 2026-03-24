import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

// GET /store/categories - List active categories (public, with hierarchy)
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const filters: Record<string, unknown> = {
    is_active: true,
  }

  // Optional: filter by parent_id for hierarchy navigation
  if (req.query.parent_id) {
    filters.parent_id = req.query.parent_id as string
  }

  const { data } = await query.graph({
    entity: "category_extension",
    fields: [
      "id",
      "name_ka",
      "name_en",
      "slug",
      "description_ka",
      "description_en",
      "image",
      "parent_id",
      "sort_order",
    ],
    filters,
  })

  res.json({ categories: data })
}
