import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

// GET /store/pages/:slug - Get a page by slug (public)
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
    ],
    filters: {
      slug: req.params.slug,
      is_active: true,
    },
  })

  if (!data.length) {
    res.status(404).json({ message: "Page not found" })
    return
  }

  res.json({ page: data[0] })
}
