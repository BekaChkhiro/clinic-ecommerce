import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import DeliveryZoneModuleService from "../../../modules/delivery-zone/service"
import { DELIVERY_ZONE_MODULE } from "../../../modules/delivery-zone"

// GET /admin/delivery-zones - List all delivery zones
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data, metadata } = await query.graph({
    entity: "delivery_zone",
    fields: ["*"],
    pagination: {
      skip: Number(req.query.offset) || 0,
      take: Number(req.query.limit) || 20,
    },
  })

  res.json({
    delivery_zones: data,
    count: metadata?.count ?? data.length,
    offset: Number(req.query.offset) || 0,
    limit: Number(req.query.limit) || 20,
  })
}

// POST /admin/delivery-zones - Create a delivery zone
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const service = req.scope.resolve<DeliveryZoneModuleService>(DELIVERY_ZONE_MODULE)

  const delivery_zone = await service.createDeliveryZones(
    req.body as Record<string, unknown>
  )

  res.status(201).json({ delivery_zone })
}
