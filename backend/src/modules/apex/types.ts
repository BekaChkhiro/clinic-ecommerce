// ============================================
// APEX ERP Integration - Type Definitions
// ============================================

export interface ApexConfig {
  baseUrl: string
  apiKey: string
  timeout?: number
  maxRetries?: number
  retryDelay?: number
}

export interface ApexRequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
  path: string
  body?: Record<string, unknown>
  params?: Record<string, string | number | boolean>
  headers?: Record<string, string>
  timeout?: number
  retries?: number
}

export interface ApexResponse<T = unknown> {
  success: boolean
  data: T
  status: number
  message?: string
}

export interface ApexError {
  status: number
  message: string
  code?: string
  details?: unknown
}

// APEX Product from ERP
export interface ApexProduct {
  id: string
  sku: string
  name_ka: string
  name_en?: string
  description_ka?: string
  description_en?: string
  price: number
  sale_price?: number
  category_id?: string
  brand_id?: string
  weight?: string
  unit?: string
  manufacturer_country?: string
  stock: number
  is_active: boolean
  image_url?: string
  images?: string[]
  barcode?: string
}

// APEX Stock item
export interface ApexStockItem {
  product_id: string
  sku: string
  stock: number
  reserved?: number
  available?: number
}

// APEX Order export format
export interface ApexOrderExport {
  order_id: string
  display_id?: number
  customer_name: string
  customer_email: string
  customer_phone?: string
  delivery_address?: string
  delivery_zone?: string
  payment_method: string
  items: ApexOrderItem[]
  subtotal: number
  delivery_fee: number
  total: number
  notes?: string
  created_at: string
}

export interface ApexOrderItem {
  product_id: string
  sku: string
  name: string
  quantity: number
  unit_price: number
  total: number
}

// Sync status tracking
export interface ApexSyncResult {
  type: "products" | "stock" | "orders"
  success: boolean
  created: number
  updated: number
  failed: number
  errors: Array<{ id: string; error: string }>
  started_at: string
  completed_at: string
  duration_ms: number
}
