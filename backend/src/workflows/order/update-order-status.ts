import {
  createWorkflow,
  createStep,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { ORDER_STATUS_MODULE } from "../../modules/order-status"
import OrderStatusModuleService from "../../modules/order-status/service"

// Valid status transitions
const VALID_TRANSITIONS: Record<string, string[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PACKED", "CANCELLED"],
  PACKED: ["COURIER_ASSIGNED", "CANCELLED"],
  COURIER_ASSIGNED: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: [],
}

type UpdateOrderStatusInput = {
  order_status_id: string
  new_status: string
  courier_name?: string
  courier_phone?: string
  cancellation_reason?: string
  notes?: string
}

const validateTransitionStep = createStep(
  "validate-status-transition",
  async (input: { current_status: string; new_status: string }) => {
    const allowed = VALID_TRANSITIONS[input.current_status] || []

    if (!allowed.includes(input.new_status)) {
      throw new Error(
        `Invalid status transition: ${input.current_status} → ${input.new_status}. ` +
        `Allowed: ${allowed.join(", ") || "none (terminal state)"}`
      )
    }

    return new StepResponse({ valid: true })
  }
)

const updateStatusStep = createStep(
  "update-order-status",
  async (
    input: UpdateOrderStatusInput & { current_status: string },
    { container }
  ) => {
    const orderStatusService = container.resolve<OrderStatusModuleService>(
      ORDER_STATUS_MODULE
    )

    const previousStatus = input.current_status

    const updateData: Record<string, unknown> = {
      status: input.new_status,
      previous_status: previousStatus,
    }

    if (input.new_status === "COURIER_ASSIGNED") {
      if (!input.courier_name || !input.courier_phone) {
        throw new Error(
          "courier_name and courier_phone are required when assigning a courier"
        )
      }
      updateData.courier_name = input.courier_name
      updateData.courier_phone = input.courier_phone
    }

    if (input.new_status === "CANCELLED" && input.cancellation_reason) {
      updateData.cancellation_reason = input.cancellation_reason
    }

    if (input.notes) {
      updateData.notes = input.notes
    }

    const updated = await orderStatusService.updateOrderStatuses(
      input.order_status_id,
      updateData
    )

    return new StepResponse(updated, {
      order_status_id: input.order_status_id,
      previous_status: previousStatus,
    })
  },
  // Compensation: revert status on failure
  async (revertData, { container }) => {
    if (!revertData) return

    const orderStatusService = container.resolve<OrderStatusModuleService>(
      ORDER_STATUS_MODULE
    )

    await orderStatusService.updateOrderStatuses(
      revertData.order_status_id,
      { status: revertData.previous_status }
    )
  }
)

export const updateOrderStatusWorkflow = createWorkflow(
  "update-order-status",
  (input: UpdateOrderStatusInput & { current_status: string }) => {
    validateTransitionStep({
      current_status: input.current_status,
      new_status: input.new_status,
    })

    const updated = updateStatusStep(input)

    return new WorkflowResponse(updated)
  }
)

export { VALID_TRANSITIONS }
