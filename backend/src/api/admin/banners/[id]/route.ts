import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import BannerModuleService from "../../../../modules/banner/service"
import { BANNER_MODULE } from "../../../../modules/banner"

// GET /admin/banners/:id - Get a single banner
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const service = req.scope.resolve<BannerModuleService>(BANNER_MODULE)

  const banner = await service.retrieveBanner(req.params.id)

  res.json({ banner })
}

// POST /admin/banners/:id - Update a banner
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const service = req.scope.resolve<BannerModuleService>(BANNER_MODULE)

  const banner = await service.updateBanners({
    id: req.params.id,
    ...(req.body as Record<string, unknown>),
  })

  res.json({ banner })
}

// DELETE /admin/banners/:id - Delete a banner
export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  const service = req.scope.resolve<BannerModuleService>(BANNER_MODULE)

  await service.deleteBanners(req.params.id)

  res.status(200).json({
    id: req.params.id,
    object: "banner",
    deleted: true,
  })
}
