import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import BannerModuleService from "../../../modules/banner/service"
import { BANNER_MODULE } from "../../../modules/banner"

// GET /admin/banners - List all banners
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data, metadata } = await query.graph({
    entity: "banner",
    fields: ["*"],
    pagination: {
      skip: Number(req.query.offset) || 0,
      take: Number(req.query.limit) || 20,
    },
  })

  res.json({
    banners: data,
    count: metadata?.count ?? data.length,
    offset: Number(req.query.offset) || 0,
    limit: Number(req.query.limit) || 20,
  })
}

// POST /admin/banners - Create a banner
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const service = req.scope.resolve<BannerModuleService>(BANNER_MODULE)

  const banner = await service.createBanners(
    req.body as Record<string, unknown>
  )

  res.status(201).json({ banner })
}
