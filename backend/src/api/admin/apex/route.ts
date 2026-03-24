import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import ApexModuleService from "../../../modules/apex/service"
import { APEX_MODULE } from "../../../modules/apex"

// GET /admin/apex - Health check and configuration status
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const apexService = req.scope.resolve<ApexModuleService>(APEX_MODULE)

  const config = apexService.getConfig()
  const health = await apexService.healthCheck()

  res.json({
    configured: health.configured,
    reachable: health.reachable,
    latency_ms: health.latency_ms,
    error: health.error,
    config: {
      base_url: config.baseUrl || "(not set)",
      api_key: config.apiKey ? "configured" : "(not set)",
      timeout: config.timeout,
      max_retries: config.maxRetries,
      retry_delay: config.retryDelay,
    },
  })
}
