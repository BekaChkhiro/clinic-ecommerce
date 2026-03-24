import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import CategoryExtensionModuleService from "../../../../modules/category-extension/service"
import { CATEGORY_EXTENSION_MODULE } from "../../../../modules/category-extension"

// GET /admin/categories/:id - Get a single category
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const service = req.scope.resolve<CategoryExtensionModuleService>(CATEGORY_EXTENSION_MODULE)

  const category = await service.retrieveCategoryExtension(req.params.id)

  res.json({ category })
}

// POST /admin/categories/:id - Update a category
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const service = req.scope.resolve<CategoryExtensionModuleService>(CATEGORY_EXTENSION_MODULE)

  const category = await service.updateCategoryExtensions({
    id: req.params.id,
    ...(req.body as Record<string, unknown>),
  })

  res.json({ category })
}

// DELETE /admin/categories/:id - Delete a category
export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  const service = req.scope.resolve<CategoryExtensionModuleService>(CATEGORY_EXTENSION_MODULE)

  await service.deleteCategoryExtensions(req.params.id)

  res.status(200).json({
    id: req.params.id,
    object: "category_extension",
    deleted: true,
  })
}
