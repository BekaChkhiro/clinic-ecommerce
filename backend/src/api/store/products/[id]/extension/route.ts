import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

// GET /store/products/:id/extension - Get product extension for storefront
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data } = await query.graph({
    entity: "product",
    fields: ["id", "product_extension.*"],
    filters: {
      id: req.params.id,
    },
  })

  const product = data[0]

  if (!product) {
    return res.status(404).json({ message: "Product not found" })
  }

  res.json({
    product_extension: (product as any).product_extension ?? null,
  })
}
