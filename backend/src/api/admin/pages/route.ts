import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import PageModuleService from "../../../modules/page/service"
import { PAGE_MODULE } from "../../../modules/page"

// GET /admin/pages - List all pages
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data, metadata } = await query.graph({
    entity: "page",
    fields: ["*"],
    pagination: {
      skip: Number(req.query.offset) || 0,
      take: Number(req.query.limit) || 20,
    },
  })

  res.json({
    pages: data,
    count: metadata?.count ?? data.length,
    offset: Number(req.query.offset) || 0,
    limit: Number(req.query.limit) || 20,
  })
}

// POST /admin/pages - Create a page
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const service = req.scope.resolve<PageModuleService>(PAGE_MODULE)

  const page = await service.createPages(
    req.body as Record<string, unknown>
  )

  res.status(201).json({ page })
}
