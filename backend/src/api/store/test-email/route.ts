import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { RESEND_NOTIFICATION_MODULE } from "../../../modules/resend_notification"
import ResendNotificationService from "../../../modules/resend_notification/service"

/**
 * POST /store/test-email
 *
 * Test endpoint to send a test email via Resend.
 * Body: { email: string, template?: string }
 *
 * NOTE: This endpoint should be removed or protected in production!
 */
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  // Only allow in development mode
  if (process.env.NODE_ENV === "production") {
    return res.status(403).json({
      success: false,
      error: "Test email endpoint is disabled in production",
    })
  }

  try {
    const { email, template = "order-confirmation" } = req.body as {
      email: string
      template?: string
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        error: "Email is required",
      })
    }

    const resendService = req.scope.resolve(RESEND_NOTIFICATION_MODULE) as ResendNotificationService

    // Test data
    const testOrderData = {
      id: "test_order_123",
      display_id: 12345,
      email,
      customer_name: "Test Customer",
      items: [
        { title: "Stevia - სტევია 100გ", quantity: 2, unit_price: 1500 },
        { title: "Chicory Coffee - ციკორის ყავა 200გ", quantity: 1, unit_price: 2500 },
      ],
      total: 5500,
      currency_code: "GEL",
      shipping_address: {
        address_1: "Test Address 123",
        city: "Tbilisi",
        phone: "+995 555 123 456",
      },
      courier_name: "გიორგი კახიანი",
      courier_phone: "+995 555 987 654",
      cancellation_reason: "მომხმარებლის მოთხოვნით",
    }

    let result

    switch (template) {
      case "order-confirmation":
        result = await resendService.sendOrderConfirmation(testOrderData)
        break
      case "order-shipped":
        result = await resendService.sendOrderShipped(testOrderData)
        break
      case "order-delivered":
        result = await resendService.sendOrderDelivered(testOrderData)
        break
      case "order-cancelled":
        result = await resendService.sendOrderCancelled(testOrderData)
        break
      case "courier-assigned":
        result = await resendService.sendCourierAssigned(testOrderData)
        break
      default:
        return res.status(400).json({
          success: false,
          error: `Invalid template: ${template}. Valid templates: order-confirmation, order-shipped, order-delivered, order-cancelled, courier-assigned`,
        })
    }

    if (result.success) {
      return res.json({
        success: true,
        message: `Test email (${template}) sent successfully to ${email}`,
      })
    } else {
      return res.status(500).json({
        success: false,
        error: result.error,
      })
    }
  } catch (error) {
    console.error("Test email error:", error)
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}
