import type {
  ApexConfig,
  ApexRequestOptions,
  ApexResponse,
  ApexError,
  ApexProduct,
  ApexStockItem,
  ApexOrderExport,
  ApexSyncResult,
} from "./types"

const DEFAULT_TIMEOUT = 30_000
const DEFAULT_MAX_RETRIES = 3
const DEFAULT_RETRY_DELAY = 1_000

export default class ApexModuleService {
  private baseUrl: string
  private apiKey: string
  private timeout: number
  private maxRetries: number
  private retryDelay: number

  constructor() {
    const baseUrl = process.env.APEX_BASE_URL
    const apiKey = process.env.APEX_API_KEY

    if (!baseUrl) {
      console.warn("APEX_BASE_URL not set - APEX integration disabled")
    }
    if (!apiKey) {
      console.warn("APEX_API_KEY not set - APEX integration disabled")
    }

    this.baseUrl = (baseUrl || "").replace(/\/+$/, "")
    this.apiKey = apiKey || ""
    this.timeout = Number(process.env.APEX_TIMEOUT) || DEFAULT_TIMEOUT
    this.maxRetries = Number(process.env.APEX_MAX_RETRIES) || DEFAULT_MAX_RETRIES
    this.retryDelay = Number(process.env.APEX_RETRY_DELAY) || DEFAULT_RETRY_DELAY
  }

  // ─── Configuration ──────────────────────────────────────

  getConfig(): ApexConfig {
    return {
      baseUrl: this.baseUrl,
      apiKey: this.apiKey ? "***" : "",
      timeout: this.timeout,
      maxRetries: this.maxRetries,
      retryDelay: this.retryDelay,
    }
  }

  isConfigured(): boolean {
    return Boolean(this.baseUrl && this.apiKey)
  }

  // ─── Core HTTP Client ───────────────────────────────────

  async request<T = unknown>(
    options: ApexRequestOptions
  ): Promise<ApexResponse<T>> {
    if (!this.isConfigured()) {
      throw this.createError(
        503,
        "APEX integration not configured. Set APEX_BASE_URL and APEX_API_KEY.",
        "APEX_NOT_CONFIGURED"
      )
    }

    const {
      method = "GET",
      path,
      body,
      params,
      headers = {},
      timeout = this.timeout,
      retries = this.maxRetries,
    } = options

    const url = this.buildUrl(path, params)

    const requestHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${this.apiKey}`,
      ...headers,
    }

    let lastError: ApexError | null = null

    for (let attempt = 0; attempt <= retries; attempt++) {
      if (attempt > 0) {
        const delay = this.calculateRetryDelay(attempt)
        console.log(
          `APEX: Retry ${attempt}/${retries} for ${method} ${path} (waiting ${delay}ms)`
        )
        await this.sleep(delay)
      }

      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), timeout)

        const response = await fetch(url, {
          method,
          headers: requestHeaders,
          body: body ? JSON.stringify(body) : undefined,
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (response.ok) {
          const data = (await response.json()) as T
          return {
            success: true,
            data,
            status: response.status,
          }
        }

        // Non-retryable client errors (4xx except 429)
        if (response.status >= 400 && response.status < 500 && response.status !== 429) {
          const errorBody = await response.text()
          throw this.createError(
            response.status,
            `APEX API error: ${response.statusText} - ${errorBody}`,
            "APEX_CLIENT_ERROR"
          )
        }

        // Retryable errors (5xx, 429)
        lastError = this.createError(
          response.status,
          `APEX API error: ${response.statusText}`,
          "APEX_SERVER_ERROR"
        )
      } catch (error) {
        if ((error as ApexError).code === "APEX_CLIENT_ERROR") {
          throw error
        }

        if (error instanceof DOMException && error.name === "AbortError") {
          lastError = this.createError(
            408,
            `APEX request timeout after ${timeout}ms`,
            "APEX_TIMEOUT"
          )
        } else if (
          error instanceof TypeError &&
          error.message.includes("fetch")
        ) {
          lastError = this.createError(
            0,
            `APEX connection error: ${error.message}`,
            "APEX_CONNECTION_ERROR"
          )
        } else {
          lastError = this.createError(
            500,
            `APEX unexpected error: ${error instanceof Error ? error.message : "Unknown"}`,
            "APEX_UNKNOWN_ERROR"
          )
        }
      }
    }

    console.error(
      `APEX: All ${retries + 1} attempts failed for ${method} ${path}`,
      lastError
    )
    throw lastError
  }

  // ─── Product Endpoints ──────────────────────────────────

  async getProducts(params?: {
    page?: number
    limit?: number
    updated_since?: string
  }): Promise<ApexResponse<ApexProduct[]>> {
    return this.request<ApexProduct[]>({
      path: "/products",
      params: params as Record<string, string | number | boolean>,
    })
  }

  async getProduct(productId: string): Promise<ApexResponse<ApexProduct>> {
    return this.request<ApexProduct>({
      path: `/products/${productId}`,
    })
  }

  // ─── Stock Endpoints ────────────────────────────────────

  async getStock(params?: {
    page?: number
    limit?: number
  }): Promise<ApexResponse<ApexStockItem[]>> {
    return this.request<ApexStockItem[]>({
      path: "/stock",
      params: params as Record<string, string | number | boolean>,
    })
  }

  async getProductStock(
    productId: string
  ): Promise<ApexResponse<ApexStockItem>> {
    return this.request<ApexStockItem>({
      path: `/stock/${productId}`,
    })
  }

  // ─── Order Endpoints ────────────────────────────────────

  async exportOrder(
    order: ApexOrderExport
  ): Promise<ApexResponse<{ apex_order_id: string }>> {
    return this.request<{ apex_order_id: string }>({
      method: "POST",
      path: "/orders",
      body: order as unknown as Record<string, unknown>,
    })
  }

  // ─── Health Check ───────────────────────────────────────

  async healthCheck(): Promise<{
    configured: boolean
    reachable: boolean
    latency_ms?: number
    error?: string
  }> {
    if (!this.isConfigured()) {
      return { configured: false, reachable: false, error: "Not configured" }
    }

    const start = Date.now()
    try {
      await this.request({
        path: "/health",
        retries: 0,
        timeout: 5_000,
      })
      return {
        configured: true,
        reachable: true,
        latency_ms: Date.now() - start,
      }
    } catch (error) {
      return {
        configured: true,
        reachable: false,
        latency_ms: Date.now() - start,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  // ─── Helpers ────────────────────────────────────────────

  private buildUrl(
    path: string,
    params?: Record<string, string | number | boolean>
  ): string {
    const url = new URL(path, this.baseUrl)
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null) {
          url.searchParams.set(key, String(value))
        }
      }
    }
    return url.toString()
  }

  private calculateRetryDelay(attempt: number): number {
    // Exponential backoff with jitter
    const exponential = this.retryDelay * Math.pow(2, attempt - 1)
    const jitter = Math.random() * this.retryDelay * 0.5
    return Math.min(exponential + jitter, 30_000)
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  private createError(
    status: number,
    message: string,
    code: string
  ): ApexError {
    return { status, message, code }
  }

  createSyncResult(
    type: ApexSyncResult["type"],
    startedAt: Date
  ): ApexSyncResult {
    return {
      type,
      success: true,
      created: 0,
      updated: 0,
      failed: 0,
      errors: [],
      started_at: startedAt.toISOString(),
      completed_at: new Date().toISOString(),
      duration_ms: Date.now() - startedAt.getTime(),
    }
  }
}
