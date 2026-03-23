import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"
import { RESEND_NOTIFICATION_MODULE } from "../modules/resend_notification"
import ResendNotificationService from "../modules/resend_notification/service"

export default async function orderPlacedHandler({
  event,
  container,
}: SubscriberArgs<{ id: string }>) {
  const orderId = event.data.id

  try {
    // Get the order service to fetch order details
    const orderService = container.resolve(Modules.ORDER)
    const resendService = container.resolve(RESEND_NOTIFICATION_MODULE) as ResendNotificationService

    // Fetch the order with relations
    const order = await orderService.retrieveOrder(orderId, {
      relations: ["items", "shipping_address"],
    })

    if (!order.email) {
      console.log(`Order ${orderId} has no email, skipping notification`)
      return
    }

    // Send order confirmation email
    const result = await resendService.sendOrderConfirmation({
      id: order.id,
      display_id: order.display_id,
      email: order.email,
      customer_name: order.shipping_address?.first_name,
      items: order.items?.map(item => ({
        title: item.title,
        quantity: item.quantity,
        unit_price: item.unit_price as number,
      })),
      total: order.total as number,
      currency_code: order.currency_code,
      shipping_address: {
        address_1: order.shipping_address?.address_1,
        city: order.shipping_address?.city,
        phone: order.shipping_address?.phone,
      },
    })

    if (result.success) {
      console.log(`Order confirmation email sent for order ${orderId}`)
    } else {
      console.error(`Failed to send order confirmation email: ${result.error}`)
    }
  } catch (error) {
    console.error(`Error in order placed handler:`, error)
  }
}

export const config: SubscriberConfig = {
  event: "order.placed",
}
