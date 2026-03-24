import { MedusaService } from "@medusajs/framework/utils"
import OrderStatus from "./models/order-status"

class OrderStatusModuleService extends MedusaService({
  OrderStatus,
}) {}

export default OrderStatusModuleService
