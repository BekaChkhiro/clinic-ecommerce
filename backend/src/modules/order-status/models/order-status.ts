import { model } from "@medusajs/framework/utils"

export const OrderStatuses = [
  "PENDING",
  "CONFIRMED",
  "PACKED",
  "COURIER_ASSIGNED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const

const OrderStatus = model.define("custom_order_status", {
  id: model.id().primaryKey(),

  // Current status
  status: model
    .enum(OrderStatuses)
    .default("PENDING"),

  // Previous status (for tracking transitions)
  previous_status: model.text().nullable(),

  // Courier info (populated when status = COURIER_ASSIGNED)
  courier_name: model.text().nullable(),
  courier_phone: model.text().nullable(),

  // Cancellation reason
  cancellation_reason: model.text().nullable(),

  // Notes (admin can add notes on status change)
  notes: model.text().nullable(),
})

export default OrderStatus
