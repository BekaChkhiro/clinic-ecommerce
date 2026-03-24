import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import ProductExtensionModuleService from "../../../modules/product-extension/service"
import { PRODUCT_EXTENSION_MODULE } from "../../../modules/product-extension"

// GET /admin/product-extensions - List all product extensions
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data, metadata } = await query.graph({
    entity: "product_extension",
    fields: ["*"],
    pagination: {
      skip: Number(req.query.offset) || 0,
      take: Number(req.query.limit) || 20,
    },
  })

  res.json({
    product_extensions: data,
    count: metadata?.count ?? data.length,
    offset: Number(req.query.offset) || 0,
    limit: Number(req.query.limit) || 20,
  })
}

// POST /admin/product-extensions - Create a product extension
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const service = req.scope.resolve<ProductExtensionModuleService>(PRODUCT_EXTENSION_MODULE)

  const productExtension = await service.createProductExtensions(
    req.body as Record<string, unknown>
  )

  res.status(201).json({ product_extension: productExtension })
}
