import { MedusaService } from "@medusajs/framework/utils"
import DeliveryZone from "./models/delivery-zone"

class DeliveryZoneModuleService extends MedusaService({
  DeliveryZone,
}) {}

export default DeliveryZoneModuleService
