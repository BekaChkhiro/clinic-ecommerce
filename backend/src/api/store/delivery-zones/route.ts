import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

// GET /store/delivery-zones - List active delivery zones (public)
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data } = await query.graph({
    entity: "delivery_zone",
    fields: [
      "id",
      "name_ka",
      "name_en",
      "fee",
      "sort_order",
    ],
    filters: {
      is_active: true,
    },
  })

  res.json({ delivery_zones: data })
}
