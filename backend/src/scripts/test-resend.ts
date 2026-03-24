import { ExecArgs } from "@medusajs/framework/types"
import { RESEND_NOTIFICATION_MODULE } from "../modules/resend_notification"
import ResendNotificationService from "../modules/resend_notification/service"

export default async function testResend({ container }: ExecArgs) {
  // Hardcoded test values - change these as needed
  // Note: In test mode, Resend only allows sending to the account owner's email
  const testEmail = "webinfinity17@gmail.com"
  const template: string = "order-confirmation"

  console.log("\n📧 Testing Resend Email Service...")
  console.log(`   Email: ${testEmail}`)
  console.log(`   Template: ${template}`)

  try {
    const resendService = container.resolve(RESEND_NOTIFICATION_MODULE) as ResendNotificationService

    // Test data with Georgian products
    const testOrderData = {
      id: "test_order_123",
      display_id: 12345,
      email: testEmail,
      customer_name: "სატესტო მომხმარებელი",
      items: [
        { title: "Stevia - სტევია 100გ", quantity: 2, unit_price: 1500 },
        { title: "Chicory Coffee - ციკორის ყავა 200გ", quantity: 1, unit_price: 2500 },
      ],
      total: 5500,
      currency_code: "GEL",
      shipping_address: {
        address_1: "ვაჟა-ფშაველას გამზ. 71",
        city: "თბილისი",
        phone: "+995 555 123 456",
      },
      courier_name: "გიორგი კახიანი",
      courier_phone: "+995 555 987 654",
      cancellation_reason: "მომხმარებლის მოთხოვნით",
    }

    let result

    switch (template) {
      case "order-confirmation":
        console.log("\n   Sending order confirmation...")
        result = await resendService.sendOrderConfirmation(testOrderData)
        break
      case "order-shipped":
        console.log("\n   Sending order shipped notification...")
        result = await resendService.sendOrderShipped(testOrderData)
        break
      case "order-delivered":
        console.log("\n   Sending order delivered notification...")
        result = await resendService.sendOrderDelivered(testOrderData)
        break
      case "order-cancelled":
        console.log("\n   Sending order cancelled notification...")
        result = await resendService.sendOrderCancelled(testOrderData)
        break
      case "courier-assigned":
        console.log("\n   Sending courier assigned notification...")
        result = await resendService.sendCourierAssigned(testOrderData)
        break
      default:
        console.log(`\n   ❌ Invalid template: ${template}`)
        console.log("   Valid templates: order-confirmation, order-shipped, order-delivered, order-cancelled, courier-assigned")
        return
    }

    if (result.success) {
      console.log("\n   ✅ Email sent successfully!")
      console.log(`   Check your inbox at: ${testEmail}`)
    } else {
      console.log("\n   ❌ Failed to send email")
      console.log(`   Error: ${result.error}`)
    }
  } catch (error: any) {
    console.error("\n   ❌ Error:", error.message || error)
  }
}
