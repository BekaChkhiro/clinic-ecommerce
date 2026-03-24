import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import DeliveryZoneModuleService from "../../../../modules/delivery-zone/service"
import { DELIVERY_ZONE_MODULE } from "../../../../modules/delivery-zone"

// GET /admin/delivery-zones/:id - Get a single delivery zone
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const service = req.scope.resolve<DeliveryZoneModuleService>(DELIVERY_ZONE_MODULE)

  const delivery_zone = await service.retrieveDeliveryZone(req.params.id)

  res.json({ delivery_zone })
}

// POST /admin/delivery-zones/:id - Update a delivery zone
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const service = req.scope.resolve<DeliveryZoneModuleService>(DELIVERY_ZONE_MODULE)

  const delivery_zone = await service.updateDeliveryZones({
    id: req.params.id,
    ...(req.body as Record<string, unknown>),
  })

  res.json({ delivery_zone })
}

// DELETE /admin/delivery-zones/:id - Delete a delivery zone
export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  const service = req.scope.resolve<DeliveryZoneModuleService>(DELIVERY_ZONE_MODULE)

  await service.deleteDeliveryZones(req.params.id)

  res.status(200).json({
    id: req.params.id,
    object: "delivery_zone",
    deleted: true,
  })
}
