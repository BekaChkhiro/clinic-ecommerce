import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import PageModuleService from "../../../../modules/page/service"
import { PAGE_MODULE } from "../../../../modules/page"

// GET /admin/pages/:id - Get a single page
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const service = req.scope.resolve<PageModuleService>(PAGE_MODULE)

  const page = await service.retrievePage(req.params.id)

  res.json({ page })
}

// POST /admin/pages/:id - Update a page
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const service = req.scope.resolve<PageModuleService>(PAGE_MODULE)

  const page = await service.updatePages({
    id: req.params.id,
    ...(req.body as Record<string, unknown>),
  })

  res.json({ page })
}

// DELETE /admin/pages/:id - Delete a page
export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  const service = req.scope.resolve<PageModuleService>(PAGE_MODULE)

  await service.deletePages(req.params.id)

  res.status(200).json({
    id: req.params.id,
    object: "page",
    deleted: true,
  })
}
