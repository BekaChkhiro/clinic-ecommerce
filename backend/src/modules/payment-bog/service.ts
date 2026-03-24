import crypto from "crypto"
import {
  AbstractPaymentProvider,
  PaymentActions,
  PaymentSessionStatus,
} from "@medusajs/framework/utils"
import type {
  AuthorizePaymentInput,
  AuthorizePaymentOutput,
  CancelPaymentInput,
  CancelPaymentOutput,
  CapturePaymentInput,
  CapturePaymentOutput,
  DeletePaymentInput,
  DeletePaymentOutput,
  GetPaymentStatusInput,
  GetPaymentStatusOutput,
  InitiatePaymentInput,
  InitiatePaymentOutput,
  RefundPaymentInput,
  RefundPaymentOutput,
  RetrievePaymentInput,
  RetrievePaymentOutput,
  UpdatePaymentInput,
  UpdatePaymentOutput,
  ProviderWebhookPayload,
  WebhookActionResult,
} from "@medusajs/framework/types"
import type {
  BogPaymentOptions,
  BogAccessToken,
  BogCreateOrderResponse,
  BogOrderDetails,
  BogCallbackPayload,
} from "./types"
import { Logger } from "@medusajs/framework/types"

class BogPaymentProviderService extends AbstractPaymentProvider {
  static identifier = "bog-ipay"

  protected options_: BogPaymentOptions
  protected logger_: Logger
  private cachedToken_: BogAccessToken | null = null

  constructor(container: Record<string, unknown>, options: BogPaymentOptions) {
    // @ts-ignore
    super(container, options)
    this.options_ = options
    this.logger_ = container.logger as Logger
  }

  /**
   * Get OAuth2 access token using client credentials grant.
   * Tokens are cached until they expire.
   */
  private async getAccessToken(): Promise<string> {
    if (
      this.cachedToken_ &&
      Date.now() - this.cachedToken_.fetched_at < (this.cachedToken_.expires_in - 60) * 1000
    ) {
      return this.cachedToken_.access_token
    }

    const credentials = Buffer.from(
      `${this.options_.clientId}:${this.options_.clientSecret}`
    ).toString("base64")

    const response = await fetch(this.options_.tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${credentials}`,
      },
      body: "grant_type=client_credentials",
    })

    if (!response.ok) {
      const text = await response.text()
      this.logger_.error(`BOG token request failed: ${response.status} ${text}`)
      throw new Error(`Failed to obtain BOG access token: ${response.status}`)
    }

    const tokenData = await response.json()
    this.cachedToken_ = {
      ...tokenData,
      fetched_at: Date.now(),
    }

    return tokenData.access_token
  }

  /**
   * Create a payment order on BOG iPay.
   */
  private async createBogOrder(
    amount: number,
    currencyCode: string,
    shopOrderId: string,
    locale: "ka" | "en" = "ka"
  ): Promise<BogCreateOrderResponse> {
    const token = await this.getAccessToken()

    // BOG expects amount in minor units (tetri) as a string
    const amountStr = amount.toString()

    const body = {
      intent: "CAPTURE",
      items: [
        {
          amount: amountStr,
          description: "MedPharma Plus Order",
          quantity: "1",
          product_id: shopOrderId,
        },
      ],
      locale,
      shop_order_id: shopOrderId,
      redirect_url: this.options_.redirectUrl,
      show_shop_order_id_on_extract: true,
      capture_method: "AUTOMATIC",
    }

    const response = await fetch(`${this.options_.apiUrl}/checkout/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const text = await response.text()
      this.logger_.error(`BOG create order failed: ${response.status} ${text}`)
      throw new Error(`Failed to create BOG payment order: ${response.status}`)
    }

    return response.json()
  }

  /**
   * Fetch order details from BOG iPay.
   */
  private async getBogOrderDetails(bogOrderId: string): Promise<BogOrderDetails> {
    const token = await this.getAccessToken()

    const response = await fetch(`${this.options_.apiUrl}/checkout/orders/${bogOrderId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const text = await response.text()
      this.logger_.error(`BOG get order failed: ${response.status} ${text}`)
      throw new Error(`Failed to fetch BOG order details: ${response.status}`)
    }

    return response.json()
  }

  /**
   * Refund a payment on BOG iPay.
   */
  private async refundBogOrder(bogOrderId: string, amount: number): Promise<void> {
    const token = await this.getAccessToken()

    const response = await fetch(`${this.options_.apiUrl}/checkout/refund`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        order_id: bogOrderId,
        amount: amount.toString(),
      }),
    })

    if (!response.ok) {
      const text = await response.text()
      this.logger_.error(`BOG refund failed: ${response.status} ${text}`)
      throw new Error(`Failed to refund BOG payment: ${response.status}`)
    }
  }

  // =============================================
  // Payment Provider Interface Methods
  // =============================================

  async initiatePayment(
    input: InitiatePaymentInput
  ): Promise<InitiatePaymentOutput> {
    const idempotencyKey = crypto.randomUUID()

    try {
      const bogOrder = await this.createBogOrder(
        Number(input.amount),
        input.currency_code,
        idempotencyKey
      )

      return {
        id: idempotencyKey,
        data: {
          bog_order_id: bogOrder.id,
          redirect_url: bogOrder._links.redirect.href,
          details_url: bogOrder._links.details.href,
          shop_order_id: idempotencyKey,
          amount: input.amount,
          currency_code: input.currency_code,
          status: "created",
        },
      }
    } catch (error) {
      this.logger_.error(`BOG initiatePayment failed: ${error}`)
      throw error
    }
  }

  async authorizePayment(
    input: AuthorizePaymentInput
  ): Promise<AuthorizePaymentOutput> {
    const bogOrderId = input.data?.bog_order_id as string

    if (!bogOrderId) {
      return {
        status: PaymentSessionStatus.ERROR,
        data: {
          ...input.data,
          error: "Missing BOG order ID",
        },
      }
    }

    try {
      const details = await this.getBogOrderDetails(bogOrderId)

      if (details.status === "COMPLETED") {
        return {
          status: PaymentSessionStatus.AUTHORIZED,
          data: {
            ...input.data,
            bog_status: details.status,
            transaction_id: details.transaction_id,
            payment_method: details.payment_method,
            card_type: details.card_type,
            pan: details.pan,
            authorized_at: new Date().toISOString(),
          },
        }
      }

      if (details.status === "REJECTED" || details.status === "TIMEOUT") {
        return {
          status: PaymentSessionStatus.ERROR,
          data: {
            ...input.data,
            bog_status: details.status,
            error: `Payment ${details.status.toLowerCase()}`,
          },
        }
      }

      // Still processing
      return {
        status: PaymentSessionStatus.PENDING,
        data: {
          ...input.data,
          bog_status: details.status,
        },
      }
    } catch (error) {
      this.logger_.error(`BOG authorizePayment failed: ${error}`)
      return {
        status: PaymentSessionStatus.ERROR,
        data: {
          ...input.data,
          error: String(error),
        },
      }
    }
  }

  async capturePayment(
    input: CapturePaymentInput
  ): Promise<CapturePaymentOutput> {
    // BOG uses AUTOMATIC capture, so payment is already captured
    // when authorized. We just record the capture.
    return {
      data: {
        ...input.data,
        captured_at: new Date().toISOString(),
      },
    }
  }

  async refundPayment(
    input: RefundPaymentInput
  ): Promise<RefundPaymentOutput> {
    const bogOrderId = input.data?.bog_order_id as string

    if (!bogOrderId) {
      throw new Error("Missing BOG order ID for refund")
    }

    try {
      await this.refundBogOrder(bogOrderId, Number(input.amount))

      return {
        data: {
          ...input.data,
          refunded_at: new Date().toISOString(),
          refund_amount: input.amount,
        },
      }
    } catch (error) {
      this.logger_.error(`BOG refundPayment failed: ${error}`)
      throw error
    }
  }

  async cancelPayment(
    input: CancelPaymentInput
  ): Promise<CancelPaymentOutput> {
    // For BOG, cancellation before capture can be treated as a void.
    // If already captured, this would need a refund instead.
    return {
      data: {
        ...input.data,
        cancelled_at: new Date().toISOString(),
      },
    }
  }

  async deletePayment(
    input: DeletePaymentInput
  ): Promise<DeletePaymentOutput> {
    return { data: input.data }
  }

  async getPaymentStatus(
    input: GetPaymentStatusInput
  ): Promise<GetPaymentStatusOutput> {
    const bogOrderId = input.data?.bog_order_id as string

    if (!bogOrderId) {
      return { status: PaymentSessionStatus.ERROR }
    }

    try {
      const details = await this.getBogOrderDetails(bogOrderId)

      switch (details.status) {
        case "COMPLETED":
          return { status: PaymentSessionStatus.AUTHORIZED }
        case "REJECTED":
        case "TIMEOUT":
          return { status: PaymentSessionStatus.ERROR }
        case "REFUNDED":
          return { status: PaymentSessionStatus.CANCELED }
        case "CREATED":
        case "PROCESSING":
        default:
          return { status: PaymentSessionStatus.PENDING }
      }
    } catch (error) {
      this.logger_.error(`BOG getPaymentStatus failed: ${error}`)
      return { status: PaymentSessionStatus.ERROR }
    }
  }

  async retrievePayment(
    input: RetrievePaymentInput
  ): Promise<RetrievePaymentOutput> {
    const bogOrderId = input.data?.bog_order_id as string

    if (!bogOrderId) {
      return { data: input.data }
    }

    try {
      const details = await this.getBogOrderDetails(bogOrderId)
      return {
        data: {
          ...input.data,
          bog_status: details.status,
          transaction_id: details.transaction_id,
          payment_method: details.payment_method,
        },
      }
    } catch {
      return { data: input.data }
    }
  }

  async updatePayment(
    input: UpdatePaymentInput
  ): Promise<UpdatePaymentOutput> {
    // BOG doesn't support updating an existing order amount.
    // Return updated local data only.
    return {
      data: {
        ...input.data,
        amount: input.amount,
        currency_code: input.currency_code,
      },
    }
  }

  async getWebhookActionAndData(
    data: ProviderWebhookPayload["payload"]
  ): Promise<WebhookActionResult> {
    const webhookBody = (data.data || {}) as Record<string, unknown>

    if (!webhookBody?.order_id) {
      this.logger_.warn("BOG webhook: missing order_id in payload")
      return { action: PaymentActions.NOT_SUPPORTED }
    }

    const order_id = webhookBody.order_id as string
    const status = webhookBody.status as number

    // BOG status codes: 1 = success, others = failure
    if (status === 1) {
      try {
        // Verify with BOG API that the order is actually completed
        const details = await this.getBogOrderDetails(order_id)

        if (details.status === "COMPLETED") {
          return {
            action: PaymentActions.AUTHORIZED,
            data: {
              session_id: details.shop_order_id,
              amount: details.amount,
            },
          }
        }
      } catch (error) {
        this.logger_.error(`BOG webhook verification failed: ${error}`)
      }
    }

    return {
      action: PaymentActions.FAILED,
      data: {
        session_id: (webhookBody.shop_order_id as string) || "",
        amount: 0,
      },
    }
  }
}

export default BogPaymentProviderService
