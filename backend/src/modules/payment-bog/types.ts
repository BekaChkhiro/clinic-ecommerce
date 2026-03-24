export interface BogPaymentOptions {
  clientId: string
  clientSecret: string
  /**
   * BOG API base URL.
   * Production: https://ipay.ge/opay/api/v1
   * Test: https://ipay.ge/opay/api/v1
   */
  apiUrl: string
  /**
   * BOG OAuth token URL.
   * https://ipay.ge/opay/api/v1/oauth2/token
   */
  tokenUrl: string
  /**
   * URL BOG redirects to after successful payment.
   */
  redirectUrl: string
  /**
   * URL BOG redirects to if customer cancels.
   */
  failUrl: string
  /**
   * Callback URL BOG sends server-to-server notifications to.
   */
  callbackUrl: string
}

export interface BogAccessToken {
  access_token: string
  token_type: string
  expires_in: number
  fetched_at: number
}

export interface BogCreateOrderRequest {
  intent: "CAPTURE" | "AUTHORIZE"
  items: Array<{
    amount: string
    description: string
    quantity: string
    product_id: string
  }>
  locale: "ka" | "en"
  shop_order_id: string
  redirect_url: string
  show_shop_order_id_on_extract: boolean
  capture_method: "AUTOMATIC" | "MANUAL"
}

export interface BogCreateOrderResponse {
  id: string
  status: string
  _links: {
    redirect: {
      href: string
    }
    details: {
      href: string
    }
  }
}

export interface BogOrderDetails {
  order_id: string
  status: "CREATED" | "PROCESSING" | "COMPLETED" | "REJECTED" | "REFUNDED" | "TIMEOUT"
  order_status: {
    key: string
    value: string
  }
  payment_hash: string
  ipay_payment_id: string
  shop_order_id: string
  payment_method?: string
  card_type?: string
  pan?: string
  transaction_id?: string
  capture_method: string
  amount: number
  pre_auth_amount?: number
  currency: string
  terminal_type: string
  created_at: string
  confirm_at?: string
}

export interface BogCallbackPayload {
  body: {
    order_id: string
    payment_hash: string
    ipay_payment_id: string
    status: number
    status_description: string
    shop_order_id: string
    payment_method: string
    card_type?: string
    pan?: string
    transaction_id?: string
    pre_auth_payment?: boolean
  }
}
