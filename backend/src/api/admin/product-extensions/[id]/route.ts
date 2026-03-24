import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import ProductExtensionModuleService from "../../../../modules/product-extension/service"
import { PRODUCT_EXTENSION_MODULE } from "../../../../modules/product-extension"

// GET /admin/product-extensions/:id - Get a single product extension
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const service = req.scope.resolve<ProductExtensionModuleService>(PRODUCT_EXTENSION_MODULE)

  const productExtension = await service.retrieveProductExtension(req.params.id)

  res.json({ product_extension: productExtension })
}

// POST /admin/product-extensions/:id - Update a product extension
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const service = req.scope.resolve<ProductExtensionModuleService>(PRODUCT_EXTENSION_MODULE)

  const productExtension = await service.updateProductExtensions({
    id: req.params.id,
    ...(req.body as Record<string, unknown>),
  })

  res.json({ product_extension: productExtension })
}

// DELETE /admin/product-extensions/:id - Delete a product extension
export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  const service = req.scope.resolve<ProductExtensionModuleService>(PRODUCT_EXTENSION_MODULE)

  await service.deleteProductExtensions(req.params.id)

  res.status(200).json({
    id: req.params.id,
    object: "product_extension",
    deleted: true,
  })
}
