import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"

/**
 * BOG iPay webhook callback endpoint.
 *
 * BOG sends a POST request here after payment is processed.
 * This endpoint forwards the payload to Medusa's payment webhook handler
 * which calls getWebhookActionAndData() on the BOG provider.
 */
export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const paymentModule = req.scope.resolve(Modules.PAYMENT)
  const logger = req.scope.resolve("logger") as any

  try {
    const result = await paymentModule.getWebhookActionAndData({
      provider: "pp_bog-ipay_bog-ipay",
      payload: {
        data: req.body as Record<string, unknown>,
        rawData: JSON.stringify(req.body),
        headers: req.headers as Record<string, unknown>,
      },
    })

    logger.info(`BOG webhook result: action=${result.action}`)

    res.status(200).json({ received: true, action: result.action })
  } catch (error) {
    logger.error(`BOG webhook processing error: ${error}`)

    // Always return 200 to BOG to prevent retries for handled errors
    res.status(200).json({ received: true, error: "Processing failed" })
  }
}
