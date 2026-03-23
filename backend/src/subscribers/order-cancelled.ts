import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"
import { RESEND_NOTIFICATION_MODULE } from "../modules/resend_notification"
import ResendNotificationService from "../modules/resend_notification/service"

export default async function orderCancelledHandler({
  event,
  container,
}: SubscriberArgs<{ id: string }>) {
  const orderId = event.data.id

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

    // Send order cancelled email
    const result = await resendService.sendOrderCancelled({
      id: order.id,
      display_id: order.display_id,
      email: order.email,
      customer_name: order.shipping_address?.first_name,
    })

    if (result.success) {
      console.log(`Order cancellation email sent for order ${orderId}`)
    } else {
      console.error(`Failed to send order cancellation email: ${result.error}`)
    }
  } catch (error) {
    console.error(`Error in order cancelled handler:`, error)
  }
}

export const config: SubscriberConfig = {
  event: "order.canceled",
}
