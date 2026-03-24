import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"
import { RESEND_NOTIFICATION_MODULE } from "../modules/resend_notification"
import ResendNotificationService from "../modules/resend_notification/service"

type OrderStatusChangedData = {
  order_id: string
  new_status: string
  previous_status: string
  courier_name?: string
  courier_phone?: string
  cancellation_reason?: string
}

export default async function orderStatusChangedHandler({
  event,
  container,
}: SubscriberArgs<OrderStatusChangedData>) {
  const {
    order_id: orderId,
    new_status: newStatus,
    courier_name,
    courier_phone,
    cancellation_reason,
  } = event.data

  try {
    const orderService = container.resolve(Modules.ORDER)
    const resendService = container.resolve(
      RESEND_NOTIFICATION_MODULE
    ) as ResendNotificationService

    const order = await orderService.retrieveOrder(orderId, {
      relations: ["items", "shipping_address"],
    })

    if (!order.email) {
      console.log(`Order ${orderId} has no email, skipping status notification`)
      return
    }

    const orderData = {
      id: order.id,
      display_id: order.display_id,
      email: order.email,
      customer_name: order.shipping_address?.first_name,
      items: order.items?.map((item) => ({
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
    }

    let result: { success: boolean; error?: string } | null = null

    switch (newStatus) {
      case "SHIPPED":
        result = await resendService.sendOrderShipped(orderData)
        break

      case "DELIVERED":
        result = await resendService.sendOrderDelivered(orderData)
        break

      case "CANCELLED":
        result = await resendService.sendOrderCancelled({
          ...orderData,
          cancellation_reason,
        })
        break

      case "COURIER_ASSIGNED":
        result = await resendService.sendCourierAssigned({
          ...orderData,
          courier_name,
          courier_phone,
        })
        break

      default:
        // No email for PENDING, CONFIRMED, PACKED
        console.log(
          `Order ${orderId} status changed to ${newStatus}, no email notification`
        )
        return
    }

    if (result?.success) {
      console.log(
        `Status change email (${newStatus}) sent for order ${orderId}`
      )
    } else if (result) {
      console.error(
        `Failed to send status email (${newStatus}): ${result.error}`
      )
    }
  } catch (error) {
    console.error(`Error in order status changed handler:`, error)
  }
}

export const config: SubscriberConfig = {
  event: "order-status.changed",
}
