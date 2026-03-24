import { loadEnv, defineConfig, Modules } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

module.exports = defineConfig({
  // Project configuration
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    }
  },

  // Admin configuration
  admin: {
    backendUrl: process.env.MEDUSA_BACKEND_URL || "http://localhost:9000",
  },

  // Module configuration
  modules: {
    // ============================================
    // PRODUCT EXTENSION MODULE - Custom product fields
    // ============================================
    productExtension: {
      resolve: "./src/modules/product-extension",
    },

    // ============================================
    // DELIVERY ZONE MODULE - Delivery zones and fees
    // ============================================
    deliveryZone: {
      resolve: "./src/modules/delivery-zone",
    },

    // ============================================
    // BRANCH MODULE - Pharmacy pickup locations
    // ============================================
    branch: {
      resolve: "./src/modules/branch",
    },

    // ============================================
    // BRAND MODULE - Product brands/manufacturers
    // ============================================
    brand: {
      resolve: "./src/modules/brand",
    },

    // ============================================
    // BANNER MODULE - Promotional banners
    // ============================================
    banner: {
      resolve: "./src/modules/banner",
    },

    // ============================================
    // CATEGORY EXTENSION MODULE - Bilingual categories with hierarchy
    // ============================================
    categoryExtension: {
      resolve: "./src/modules/category-extension",
    },

    // ============================================
    // PAGE MODULE - CMS static pages
    // ============================================
    page: {
      resolve: "./src/modules/page",
    },

    // ============================================
    // ORDER STATUS MODULE - Custom order statuses
    // ============================================
    orderStatus: {
      resolve: "./src/modules/order-status",
    },

    // ============================================
    // RESEND NOTIFICATION MODULE - Email Service
    // ============================================
    resend_notification: {
      resolve: "./src/modules/resend_notification",
    },

    // ============================================
    // FILE MODULE - Cloudflare R2 Storage
    // ============================================
    [Modules.FILE]: {
      resolve: "@medusajs/file",
      options: {
        providers: [
          {
            resolve: "@medusajs/file-s3",
            id: "s3",
            options: {
              file_url: process.env.S3_FILE_URL,
              access_key_id: process.env.S3_ACCESS_KEY_ID,
              secret_access_key: process.env.S3_SECRET_ACCESS_KEY,
              region: process.env.S3_REGION,
              bucket: process.env.S3_BUCKET,
              endpoint: process.env.S3_ENDPOINT,
              // Cloudflare R2 specific settings
              additional_client_config: {
                forcePathStyle: true,
              },
            },
          },
        ],
      },
    },

    // ============================================
    // AUTH MODULE - Admin authentication
    // ============================================
    [Modules.AUTH]: {
      resolve: "@medusajs/medusa/auth",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/auth-emailpass",
            id: "emailpass",
          },
        ],
      },
    },

    // ============================================
    // DISABLED MODULES
    // ============================================

    // Customer module - enabled (required by admin panel and orders)
    // Guest checkout is handled on storefront side
    // [Modules.CUSTOMER]: default,

    // Inventory module - enabled (required for product creation)
    // Note: Stock values will be synced from APEX ERP (Phase 4)
    // [Modules.INVENTORY]: default

    // Stock Location module - enabled (required for inventory)
    // [Modules.STOCK_LOCATION]: default

    // ============================================
    // ACTIVE MODULES (using defaults)
    // ============================================
    // - Product: Core product management
    // - Cart: Shopping cart functionality
    // - Order: Order processing
    // - Payment: BOG iPay + Cash on Delivery
    // - Pricing: Product pricing
    // - Region: Georgian Lari (GEL) region
    // - Tax: Tax calculations
    // - Sales Channel: Store channel
    // - Fulfillment: Shipping/delivery
    // - Promotion: Discount codes, campaigns (kept per business requirement)
  },
})
