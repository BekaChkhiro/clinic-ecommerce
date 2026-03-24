import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import ProductExtensionModuleService from "../../../../../modules/product-extension/service"
import { PRODUCT_EXTENSION_MODULE } from "../../../../../modules/product-extension"

// GET /admin/products/:id/extension - Get product extension linked to a product
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

// POST /admin/products/:id/extension - Create or update product extension for a product
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const service = req.scope.resolve<ProductExtensionModuleService>(PRODUCT_EXTENSION_MODULE)
  const remoteLink = req.scope.resolve(ContainerRegistrationKeys.REMOTE_LINK)
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  // Check if product already has an extension
  const { data: existing } = await query.graph({
    entity: "product",
    fields: ["id", "product_extension.*"],
    filters: {
      id: req.params.id,
    },
  })

  const product = existing[0] as any

  if (!product) {
    return res.status(404).json({ message: "Product not found" })
  }

  if (product.product_extension) {
    // Update existing extension
    const updated = await service.updateProductExtensions({
      id: product.product_extension.id,
      ...(req.body as Record<string, unknown>),
    })

    return res.json({ product_extension: updated })
  }

  // Create new extension and link to product
  const extension = await service.createProductExtensions(
    req.body as Record<string, unknown>
  )

  await remoteLink.create({
    [Modules.PRODUCT]: {
      product_id: req.params.id,
    },
    [PRODUCT_EXTENSION_MODULE]: {
      product_extension_id: extension.id,
    },
  })

  res.status(201).json({ product_extension: extension })
}
