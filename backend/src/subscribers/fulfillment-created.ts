import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"
import { RESEND_NOTIFICATION_MODULE } from "../modules/resend_notification"
import ResendNotificationService from "../modules/resend_notification/service"

export default async function fulfillmentCreatedHandler({
  event,
  container,
}: SubscriberArgs<{ id: string; order_id: string }>) {
  const { order_id: orderId } = event.data

  if (!orderId) {
    console.log("Fulfillment created event has no order_id, skipping")
    return
  }

  try {
    // Get the order service to fetch order details
    const orderService = container.resolve(Modules.ORDER)
    const resendService = container.resolve(RESEND_NOTIFICATION_MODULE) as ResendNotificationService

    // Fetch the order
    const order = await orderService.retrieveOrder(orderId, {
      relations: ["shipping_address"],
    })

    if (!order.email) {
      console.log(`Order ${orderId} has no email, skipping notification`)
      return
    }

    // Send order shipped email
    const result = await resendService.sendOrderShipped({
      id: order.id,
      display_id: order.display_id,
      email: order.email,
      customer_name: order.shipping_address?.first_name,
    })

    if (result.success) {
      console.log(`Order shipped email sent for order ${orderId}`)
    } else {
      console.error(`Failed to send order shipped email: ${result.error}`)
    }
  } catch (error) {
    console.error(`Error in fulfillment created handler:`, error)
  }
}

export const config: SubscriberConfig = {
  event: "fulfillment.created",
}
