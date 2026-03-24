import { defineLink } from "@medusajs/framework/utils"
import OrderModule from "@medusajs/medusa/order"
import OrderStatusModule from "../modules/order-status"

export default defineLink(
  OrderModule.linkable.order,
  {
    linkable: OrderStatusModule.linkable.customOrderStatus,
    isList: false,
  }
)
