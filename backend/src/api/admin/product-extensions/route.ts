import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import ProductExtensionModuleService from "../../../modules/product-extension/service"
import { PRODUCT_EXTENSION_MODULE } from "../../../modules/product-extension"

// GET /admin/product-extensions - List all products with their extension data
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data } = await query.graph({
    entity: "product",
    fields: [
      "id",
      "title",
      "handle",
      "thumbnail",
      "status",
      "product_extension.id",
      "product_extension.name_ka",
      "product_extension.name_en",
      "product_extension.is_sugar_free",
      "product_extension.is_low_protein",
      "product_extension.is_diabetic_friendly",
      "product_extension.is_gluten_free",
      "product_extension.product_type",
      "product_extension.manufacturer_country",
      "product_extension.apex_id",
    ],
    pagination: {
      skip: Number(req.query.offset) || 0,
      take: Number(req.query.limit) || 200,
    },
  })

  res.json({
    products: data,
    count: data.length,
    offset: Number(req.query.offset) || 0,
    limit: Number(req.query.limit) || 200,
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
