import { Resend } from "resend"

type EmailTemplate =
  | "order-confirmation"
  | "order-shipped"
  | "order-delivered"
  | "order-cancelled"
  | "courier-assigned"

interface OrderItem {
  title: string
  quantity: number
  unit_price: number | string
}

interface OrderData {
  id: string
  display_id?: number
  email: string
  customer_name?: string
  items?: OrderItem[]
  total?: number | string
  currency_code?: string
  shipping_address?: {
    address_1?: string
    city?: string
    phone?: string
  }
  status?: string
  courier_name?: string
  courier_phone?: string
  cancellation_reason?: string
}

interface SendEmailOptions {
  to: string
  template: EmailTemplate
  data: OrderData
}

export default class ResendNotificationService {
  private resend: Resend
  private fromEmail: string
  private fromName: string

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY)
    this.fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev"
    this.fromName = process.env.RESEND_FROM_NAME || "MedPharma Plus"
  }

  async sendEmail({ to, template, data }: SendEmailOptions): Promise<{ success: boolean; error?: string }> {
    try {
      const { subject, body } = this.getEmailContent(template, data)

      const result = await this.resend.emails.send({
        from: `${this.fromName} <${this.fromEmail}>`,
        to: [to],
        subject,
        text: body,
      })

      if (result.error) {
        console.error("Resend error:", result.error)
        return { success: false, error: result.error.message }
      }

      console.log(`Email sent successfully to ${to}, template: ${template}`)
      return { success: true }
    } catch (error) {
      console.error("Failed to send email:", error)
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
    }
  }

  private getEmailContent(template: EmailTemplate, data: OrderData): { subject: string; body: string } {
    const orderId = String(data.display_id || data.id?.slice(-8) || "N/A")

    switch (template) {
      case "order-confirmation":
        return this.orderConfirmationTemplate(data, orderId)
      case "order-shipped":
        return this.orderShippedTemplate(data, orderId)
      case "order-delivered":
        return this.orderDeliveredTemplate(data, orderId)
      case "order-cancelled":
        return this.orderCancelledTemplate(data, orderId)
      case "courier-assigned":
        return this.courierAssignedTemplate(data, orderId)
      default:
        return { subject: "MedPharma Plus", body: "Thank you for your order." }
    }
  }

  private formatPrice(value: number | string | undefined): string {
    if (value === undefined) return "0.00"
    const numValue = typeof value === "string" ? parseFloat(value) : value
    return (numValue / 100).toFixed(2)
  }

  private orderConfirmationTemplate(data: OrderData, orderId: string): { subject: string; body: string } {
    const itemsList = data.items?.map(item =>
      `  - ${item.title} x${item.quantity} - ${this.formatPrice(item.unit_price)} GEL`
    ).join("\n") || ""

    const total = this.formatPrice(data.total)

    return {
      subject: `შეკვეთა #${orderId} დადასტურებულია / Order #${orderId} Confirmed`,
      body: `
═══════════════════════════════════════════════════════════
მედფარმა პლუსი / MEDPHARMA PLUS
═══════════════════════════════════════════════════════════

🇬🇪 ქართული
───────────────────────────────────────────────────────────

გამარჯობა${data.customer_name ? `, ${data.customer_name}` : ""}!

თქვენი შეკვეთა #${orderId} წარმატებით მიღებულია!

📦 შეკვეთის დეტალები:
${itemsList}

💰 ჯამი: ${total} GEL

📍 მიწოდების მისამართი:
${data.shipping_address?.address_1 || ""}
${data.shipping_address?.city || ""}
📞 ${data.shipping_address?.phone || ""}

მადლობა რომ აირჩიეთ მედფარმა პლუსი!


🇬🇧 English
───────────────────────────────────────────────────────────

Hello${data.customer_name ? `, ${data.customer_name}` : ""}!

Your order #${orderId} has been successfully received!

📦 Order Details:
${itemsList}

💰 Total: ${total} GEL

📍 Delivery Address:
${data.shipping_address?.address_1 || ""}
${data.shipping_address?.city || ""}
📞 ${data.shipping_address?.phone || ""}

Thank you for choosing MedPharma Plus!

───────────────────────────────────────────────────────────
მედფარმა პლუსი აფთიაქი
APOTEKA MEDPHARMA PLUS
═══════════════════════════════════════════════════════════
      `.trim()
    }
  }

  private orderShippedTemplate(data: OrderData, orderId: string): { subject: string; body: string } {
    return {
      subject: `შეკვეთა #${orderId} გაგზავნილია / Order #${orderId} Shipped`,
      body: `
═══════════════════════════════════════════════════════════
მედფარმა პლუსი / MEDPHARMA PLUS
═══════════════════════════════════════════════════════════

🇬🇪 ქართული
───────────────────────────────────────────────────────────

გამარჯობა${data.customer_name ? `, ${data.customer_name}` : ""}!

თქვენი შეკვეთა #${orderId} გაგზავნილია! 🚚

შეკვეთა მალე მოგაწვდით მითითებულ მისამართზე.


🇬🇧 English
───────────────────────────────────────────────────────────

Hello${data.customer_name ? `, ${data.customer_name}` : ""}!

Your order #${orderId} has been shipped! 🚚

Your order will arrive soon at the specified address.

───────────────────────────────────────────────────────────
მედფარმა პლუსი აფთიაქი
APOTEKA MEDPHARMA PLUS
═══════════════════════════════════════════════════════════
      `.trim()
    }
  }

  private orderDeliveredTemplate(data: OrderData, orderId: string): { subject: string; body: string } {
    return {
      subject: `შეკვეთა #${orderId} მიწოდებულია / Order #${orderId} Delivered`,
      body: `
═══════════════════════════════════════════════════════════
მედფარმა პლუსი / MEDPHARMA PLUS
═══════════════════════════════════════════════════════════

🇬🇪 ქართული
───────────────────────────────────────────────────────────

გამარჯობა${data.customer_name ? `, ${data.customer_name}` : ""}!

თქვენი შეკვეთა #${orderId} წარმატებით მიწოდებულია! ✅

მადლობა რომ აირჩიეთ მედფარმა პლუსი!
ვიმედოვნებთ კვლავ გნახავთ ჩვენთან.


🇬🇧 English
───────────────────────────────────────────────────────────

Hello${data.customer_name ? `, ${data.customer_name}` : ""}!

Your order #${orderId} has been delivered! ✅

Thank you for choosing MedPharma Plus!
We hope to see you again.

───────────────────────────────────────────────────────────
მედფარმა პლუსი აფთიაქი
APOTEKA MEDPHARMA PLUS
═══════════════════════════════════════════════════════════
      `.trim()
    }
  }

  private orderCancelledTemplate(data: OrderData, orderId: string): { subject: string; body: string } {
    const reason = data.cancellation_reason || ""

    return {
      subject: `შეკვეთა #${orderId} გაუქმებულია / Order #${orderId} Cancelled`,
      body: `
═══════════════════════════════════════════════════════════
მედფარმა პლუსი / MEDPHARMA PLUS
═══════════════════════════════════════════════════════════

🇬🇪 ქართული
───────────────────────────────────────────────────────────

გამარჯობა${data.customer_name ? `, ${data.customer_name}` : ""}!

თქვენი შეკვეთა #${orderId} გაუქმებულია.
${reason ? `მიზეზი: ${reason}` : ""}

თუ გაქვთ შეკითხვები, გთხოვთ დაგვიკავშირდეთ.


🇬🇧 English
───────────────────────────────────────────────────────────

Hello${data.customer_name ? `, ${data.customer_name}` : ""}!

Your order #${orderId} has been cancelled.
${reason ? `Reason: ${reason}` : ""}

If you have any questions, please contact us.

───────────────────────────────────────────────────────────
მედფარმა პლუსი აფთიაქი
APOTEKA MEDPHARMA PLUS
═══════════════════════════════════════════════════════════
      `.trim()
    }
  }

  private courierAssignedTemplate(data: OrderData, orderId: string): { subject: string; body: string } {
    return {
      subject: `კურიერი მინიჭებულია შეკვეთა #${orderId} / Courier Assigned Order #${orderId}`,
      body: `
═══════════════════════════════════════════════════════════
მედფარმა პლუსი / MEDPHARMA PLUS
═══════════════════════════════════════════════════════════

🇬🇪 ქართული
───────────────────────────────────────────────────────────

გამარჯობა${data.customer_name ? `, ${data.customer_name}` : ""}!

თქვენს შეკვეთას #${orderId} კურიერი მიენიჭა! 🛵

🚴 კურიერის ინფორმაცია:
   სახელი: ${data.courier_name || "N/A"}
   ტელეფონი: ${data.courier_phone || "N/A"}

შეკვეთა მალე მოგაწვდით!


🇬🇧 English
───────────────────────────────────────────────────────────

Hello${data.customer_name ? `, ${data.customer_name}` : ""}!

A courier has been assigned to your order #${orderId}! 🛵

🚴 Courier Information:
   Name: ${data.courier_name || "N/A"}
   Phone: ${data.courier_phone || "N/A"}

Your order will arrive soon!

───────────────────────────────────────────────────────────
მედფარმა პლუსი აფთიაქი
APOTEKA MEDPHARMA PLUS
═══════════════════════════════════════════════════════════
      `.trim()
    }
  }

  // Utility method to send order confirmation
  async sendOrderConfirmation(order: OrderData): Promise<{ success: boolean; error?: string }> {
    return this.sendEmail({
      to: order.email,
      template: "order-confirmation",
      data: order,
    })
  }

  // Utility method to send order shipped notification
  async sendOrderShipped(order: OrderData): Promise<{ success: boolean; error?: string }> {
    return this.sendEmail({
      to: order.email,
      template: "order-shipped",
      data: order,
    })
  }

  // Utility method to send order delivered notification
  async sendOrderDelivered(order: OrderData): Promise<{ success: boolean; error?: string }> {
    return this.sendEmail({
      to: order.email,
      template: "order-delivered",
      data: order,
    })
  }

  // Utility method to send order cancelled notification
  async sendOrderCancelled(order: OrderData): Promise<{ success: boolean; error?: string }> {
    return this.sendEmail({
      to: order.email,
      template: "order-cancelled",
      data: order,
    })
  }

  // Utility method to send courier assigned notification
  async sendCourierAssigned(order: OrderData): Promise<{ success: boolean; error?: string }> {
    return this.sendEmail({
      to: order.email,
      template: "courier-assigned",
      data: order,
    })
  }
}
