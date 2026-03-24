import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

// GET /store/branches - List active branches (public)
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data } = await query.graph({
    entity: "branch",
    fields: [
      "id",
      "name_ka",
      "name_en",
      "address_ka",
      "address_en",
      "phone",
      "working_hours",
      "delivery_info_ka",
      "delivery_info_en",
      "coordinates",
      "sort_order",
    ],
    filters: {
      is_active: true,
    },
  })

  res.json({ branches: data })
}
