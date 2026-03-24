import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import CategoryExtensionModuleService from "../../../modules/category-extension/service"
import { CATEGORY_EXTENSION_MODULE } from "../../../modules/category-extension"

// GET /admin/categories - List all categories
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data, metadata } = await query.graph({
    entity: "category_extension",
    fields: ["*"],
    pagination: {
      skip: Number(req.query.offset) || 0,
      take: Number(req.query.limit) || 20,
    },
  })

  res.json({
    categories: data,
    count: metadata?.count ?? data.length,
    offset: Number(req.query.offset) || 0,
    limit: Number(req.query.limit) || 20,
  })
}

// POST /admin/categories - Create a category
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const service = req.scope.resolve<CategoryExtensionModuleService>(CATEGORY_EXTENSION_MODULE)

  const category = await service.createCategoryExtensions(
    req.body as Record<string, unknown>
  )

  res.status(201).json({ category })
}
