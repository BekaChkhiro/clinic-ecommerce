import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import BrandModuleService from "../../../modules/brand/service"
import { BRAND_MODULE } from "../../../modules/brand"

// GET /admin/brands - List all brands
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data, metadata } = await query.graph({
    entity: "brand",
    fields: ["*"],
    pagination: {
      skip: Number(req.query.offset) || 0,
      take: Number(req.query.limit) || 20,
    },
  })

  res.json({
    brands: data,
    count: metadata?.count ?? data.length,
    offset: Number(req.query.offset) || 0,
    limit: Number(req.query.limit) || 20,
  })
}

// POST /admin/brands - Create a brand
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const service = req.scope.resolve<BrandModuleService>(BRAND_MODULE)

  const brand = await service.createBrands(
    req.body as Record<string, unknown>
  )

  res.status(201).json({ brand })
}
