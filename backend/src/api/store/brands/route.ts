import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

// GET /store/brands - List active brands (public)
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data } = await query.graph({
    entity: "brand",
    fields: [
      "id",
      "name_ka",
      "name_en",
      "slug",
      "country",
      "logo",
      "sort_order",
    ],
    filters: {
      is_active: true,
    },
  })

  res.json({ brands: data })
}
