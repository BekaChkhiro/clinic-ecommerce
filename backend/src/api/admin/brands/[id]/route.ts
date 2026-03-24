import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import BrandModuleService from "../../../../modules/brand/service"
import { BRAND_MODULE } from "../../../../modules/brand"

// GET /admin/brands/:id - Get a single brand
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const service = req.scope.resolve<BrandModuleService>(BRAND_MODULE)

  const brand = await service.retrieveBrand(req.params.id)

  res.json({ brand })
}

// POST /admin/brands/:id - Update a brand
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const service = req.scope.resolve<BrandModuleService>(BRAND_MODULE)

  const brand = await service.updateBrands({
    id: req.params.id,
    ...(req.body as Record<string, unknown>),
  })

  res.json({ brand })
}

// DELETE /admin/brands/:id - Delete a brand
export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  const service = req.scope.resolve<BrandModuleService>(BRAND_MODULE)

  await service.deleteBrands(req.params.id)

  res.status(200).json({
    id: req.params.id,
    object: "brand",
    deleted: true,
  })
}
