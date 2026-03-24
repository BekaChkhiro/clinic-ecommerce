import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

// GET /store/pages - List active pages (public)
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data } = await query.graph({
    entity: "page",
    fields: [
      "id",
      "slug",
      "title_ka",
      "title_en",
      "content_ka",
      "content_en",
      "meta_title_ka",
      "meta_title_en",
      "meta_description_ka",
      "meta_description_en",
      "sort_order",
    ],
    filters: {
      is_active: true,
    },
  })

  res.json({ pages: data })
}
