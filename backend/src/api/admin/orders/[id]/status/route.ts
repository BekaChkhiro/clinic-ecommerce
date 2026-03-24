import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys, Modules, MedusaError } from "@medusajs/framework/utils"
import type { IEventBusService } from "@medusajs/framework/types"
import { ORDER_STATUS_MODULE } from "../../../../../modules/order-status"
import OrderStatusModuleService from "../../../../../modules/order-status/service"
import { updateOrderStatusWorkflow, VALID_TRANSITIONS } from "../../../../../workflows/order"

// GET /admin/orders/:id/status - Get order's custom status
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id } = req.params

  try {
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

    // Query the order with its linked order_status
    const { data } = await query.graph({
      entity: "order",
      fields: ["id", "display_id", "custom_order_status.*"],
      filters: { id },
    })

    if (!data.length) {
      return res.status(404).json({ message: `Order ${id} not found` })
    }

    const order = data[0]

    res.json({
      order_id: order.id,
      display_id: order.display_id,
      order_status: (order as any).custom_order_status || null,
      valid_transitions: (order as any).custom_order_status
        ? VALID_TRANSITIONS[(order as any).custom_order_status.status] || []
        : VALID_TRANSITIONS["PENDING"],
    })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

// POST /admin/orders/:id/status - Update order status
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id } = req.params
  const { status, courier_name, courier_phone, cancellation_reason, notes } =
    req.body as {
      status: string
      courier_name?: string
      courier_phone?: string
      cancellation_reason?: string
      notes?: string
    }

  if (!status) {
    return res.status(400).json({ message: "status is required" })
  }

  try {
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
    const orderStatusService = req.scope.resolve<OrderStatusModuleService>(
      ORDER_STATUS_MODULE
    )
    const remoteLink = req.scope.resolve(ContainerRegistrationKeys.REMOTE_LINK)

    // Check if order has an existing order_status link
    const { data } = await query.graph({
      entity: "order",
      fields: ["id", "custom_order_status.*"],
      filters: { id },
    })

    if (!data.length) {
      return res.status(404).json({ message: `Order ${id} not found` })
    }

    const order = data[0]
    const existingStatus = (order as any).custom_order_status

    if (existingStatus) {
      // Update existing status via workflow
      const result = await updateOrderStatusWorkflow(req.scope).run({
        input: {
          order_status_id: existingStatus.id,
          current_status: existingStatus.status,
          new_status: status,
          courier_name,
          courier_phone,
          cancellation_reason,
          notes,
        },
      })

      // Emit event for notifications
      const eventBus = req.scope.resolve<IEventBusService>(Modules.EVENT_BUS)
      await eventBus.emit("order-status.changed", {
        order_id: id,
        new_status: status,
        previous_status: existingStatus.status,
        courier_name,
        courier_phone,
        cancellation_reason,
      })

      res.json({
        order_id: id,
        order_status: result.result,
        message: `Status updated: ${existingStatus.status} → ${status}`,
      })
    } else {
      // First status update - create order_status record and link it
      if (status !== "PENDING" && status !== "CONFIRMED") {
        // Validate: new orders should start at PENDING or CONFIRMED
        const allowed = VALID_TRANSITIONS["PENDING"]
        if (!allowed.includes(status) && status !== "PENDING") {
          return res.status(400).json({
            message: `Cannot set initial status to ${status}. Must be PENDING or CONFIRMED.`,
          })
        }
      }

      const orderStatus = await orderStatusService.createOrderStatuses({
        status,
        courier_name: status === "COURIER_ASSIGNED" ? courier_name : undefined,
        courier_phone: status === "COURIER_ASSIGNED" ? courier_phone : undefined,
        cancellation_reason: status === "CANCELLED" ? cancellation_reason : undefined,
        notes,
      })

      // Create the link between order and order_status
      await remoteLink.create({
        [Modules.ORDER]: { order_id: id },
        orderStatus: { custom_order_status_id: orderStatus.id },
      })

      // Emit event for notifications (skip for PENDING - that's the default)
      if (status !== "PENDING") {
        const eventBus = req.scope.resolve<IEventBusService>(Modules.EVENT_BUS)
        await eventBus.emit("order-status.changed", {
          order_id: id,
          new_status: status,
          previous_status: "PENDING",
          courier_name,
          courier_phone,
          cancellation_reason,
        })
      }

      res.status(201).json({
        order_id: id,
        order_status: orderStatus,
        message: `Status set to ${status}`,
      })
    }
  } catch (error: any) {
    if (error.message?.includes("Invalid status transition")) {
      return res.status(400).json({ message: error.message })
    }
    if (error.message?.includes("courier_name and courier_phone are required")) {
      return res.status(400).json({ message: error.message })
    }
    res.status(500).json({ message: error.message })
  }
}
