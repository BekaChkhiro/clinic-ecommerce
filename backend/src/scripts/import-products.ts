import { ExecArgs } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils"
import {
  createProductsWorkflow,
} from "@medusajs/medusa/core-flows"
import * as fs from "fs"
import * as path from "path"

// ── Types ──

interface RawProduct {
  num: number
  name: string
  category: string
  country: string
  manufacturer: string
  price: number
  image: string
  handle: string
  is_sugar_free: boolean
  is_low_protein: boolean
  is_diabetic_friendly: boolean
  is_gluten_free: boolean
}

// ── Helpers ──

function slugify(text: string): string {
  // Transliterate common Cyrillic
  const cyrillic: Record<string, string> = {
    а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "yo", ж: "zh",
    з: "z", и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o",
    п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "kh", ц: "ts",
    ч: "ch", ш: "sh", щ: "shch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
    М: "m", а: "a", к: "k",
  }
  let result = text.toLowerCase()
  for (const [k, v] of Object.entries(cyrillic)) {
    result = result.split(k.toLowerCase()).join(v)
  }
  return result
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .trim() || "product"
}

function generateSku(product: RawProduct): string {
  const prefix = product.category
    .split("-")
    .map((w) => w[0]?.toUpperCase())
    .join("")
  return `${prefix}-${String(product.num).padStart(3, "0")}`
}

// ── Main Import ──

export default async function importProducts({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const link = container.resolve(ContainerRegistrationKeys.LINK)
  const fileService = container.resolve(Modules.FILE)
  const salesChannelService = container.resolve(Modules.SALES_CHANNEL)

  const IMPORT_DIR = path.join(__dirname, "import-data")
  const IMAGES_DIR = path.join(IMPORT_DIR, "images")

  // ── Step 1: Load product data ──
  logger.info("Loading product data...")
  const rawProducts: RawProduct[] = JSON.parse(
    fs.readFileSync(path.join(IMPORT_DIR, "products.json"), "utf-8")
  )
  logger.info(`Loaded ${rawProducts.length} products`)

  // ── Step 2: Get prerequisites ──
  logger.info("Loading prerequisites...")

  // Get default sales channel
  const salesChannels = await salesChannelService.listSalesChannels({
    name: "Default Sales Channel",
  })
  if (!salesChannels.length) {
    throw new Error("Default Sales Channel not found. Run seed first.")
  }
  const salesChannelId = salesChannels[0].id

  // Get shipping profile
  const fulfillmentService = container.resolve(Modules.FULFILLMENT)
  const shippingProfiles = await fulfillmentService.listShippingProfiles({
    type: "default",
  })
  if (!shippingProfiles.length) {
    throw new Error("Default shipping profile not found. Run seed first.")
  }
  const shippingProfileId = shippingProfiles[0].id

  // Create product categories if they don't exist
  const categoryMap: Record<string, string> = {}
  const neededCategories = [
    { name: "Sugar Substitutes", handle: "sugar-substitutes" },
    { name: "Chicory Coffee", handle: "chicory-coffee" },
    { name: "Sugar-Free Snacks", handle: "sugar-free-snacks" },
    { name: "Low Protein (PKU)", handle: "low-protein-pku" },
  ]

  const { data: existingCategories } = await query.graph({
    entity: "product_category",
    fields: ["id", "handle", "name"],
  })

  for (const cat of existingCategories) {
    if (cat.handle) categoryMap[cat.handle] = cat.id
  }

  const productCategoryService = container.resolve(Modules.PRODUCT)
  for (const needed of neededCategories) {
    if (!categoryMap[needed.handle]) {
      try {
        const [created] = await (productCategoryService as any).createProductCategories([
          { name: needed.name, handle: needed.handle, is_active: true },
        ])
        categoryMap[needed.handle] = created.id
        logger.info(`  Created category: ${needed.name}`)
      } catch (e: any) {
        logger.warn(`  Failed to create category "${needed.name}": ${e.message}`)
      }
    } else {
      logger.info(`  Category "${needed.name}" already exists`)
    }
  }
  logger.info(`Categories ready: ${Object.keys(categoryMap).length}`)

  // ── Step 3: Create brands ──
  logger.info("Creating brands...")
  const brandService = container.resolve("brand") as any

  const brandData = [
    { name_ka: "ნოვასვიტი", name_en: "Novasweet", slug: "novasweet", country: "Russia" },
    { name_ka: "ბიონოვა", name_en: "Bionova", slug: "bionova", country: "Russia" },
    { name_ka: "მევალია", name_en: "Mevalia", slug: "mevalia", country: "Italy" },
    { name_ka: "მაკმასტერი", name_en: "MacMaster", slug: "macmaster", country: "Russia" },
    { name_ka: "ოლ ლაიტი", name_en: "Ol Lite", slug: "ol-lite", country: "Russia" },
  ]

  const brandMap: Record<string, string> = {}
  for (const b of brandData) {
    try {
      const existing = await brandService.listBrands({ slug: b.slug })
      if (existing?.length) {
        brandMap[b.slug] = existing[0].id
        logger.info(`  Brand "${b.name_en}" already exists`)
      } else {
        const created = await brandService.createBrands({
          ...b,
          is_active: true,
          sort_order: 0,
        })
        brandMap[b.slug] = created.id
        logger.info(`  Created brand "${b.name_en}"`)
      }
    } catch (e: any) {
      logger.warn(`  Failed to create brand "${b.name_en}": ${e.message}`)
    }
  }

  // Map manufacturer name -> brand slug
  const mfrToBrandSlug: Record<string, string> = {
    novasweet: "novasweet",
    Novasweet: "novasweet",
    Bionova: "bionova",
    Mevalia: "mevalia",
    "МакМастер": "macmaster",
    "ol lite": "ol-lite",
  }

  // ── Step 4: Upload images ──
  logger.info("Uploading product images...")
  const imageUrlMap: Record<number, string> = {}

  for (const product of rawProducts) {
    const imagePath = path.join(IMAGES_DIR, product.image)
    if (!fs.existsSync(imagePath)) {
      logger.warn(`  Image not found: ${product.image}`)
      continue
    }

    try {
      const fileBuffer = fs.readFileSync(imagePath)
      const ext = path.extname(product.image).slice(1)
      const mimeType =
        ext === "png" ? "image/png" : ext === "jpeg" ? "image/jpeg" : "image/jpeg"

      const [uploaded] = await fileService.createFiles([
        {
          filename: `product-${product.num}.${ext}`,
          mimeType,
          content: fileBuffer.toString("base64"),
          access: "public" as const,
        },
      ])

      imageUrlMap[product.num] = uploaded.url
      if (product.num % 10 === 0 || product.num === 1) {
        logger.info(`  Uploaded ${product.num}/${rawProducts.length} images...`)
      }
    } catch (e: any) {
      logger.warn(`  Failed to upload image for product #${product.num}: ${e.message}`)
    }
  }
  logger.info(`Uploaded ${Object.keys(imageUrlMap).length} images`)

  // ── Step 5: Check existing products and create new ones ──
  logger.info("Checking existing products...")

  const { data: existingProducts } = await query.graph({
    entity: "product",
    fields: ["id", "handle"],
  })
  const existingHandles = new Set(existingProducts.map((p: any) => p.handle))
  logger.info(`Found ${existingProducts.length} existing products`)

  // Process in batches of 5 (smaller batches = fewer link conflicts)
  const BATCH_SIZE = 5
  let created = 0
  let skipped = 0

  for (let i = 0; i < rawProducts.length; i += BATCH_SIZE) {
    const batch = rawProducts.slice(i, i + BATCH_SIZE)

    const productsInput = batch
      .filter((p) => {
        if (!p.name || p.price <= 0) return false
        const handle = `medpharma-${p.num}-${slugify(p.manufacturer || "product")}`
        if (existingHandles.has(handle)) {
          skipped++
          return false
        }
        return true
      })
      .map((p) => {
        const priceInTetri = Math.round(p.price * 100)
        const imageUrl = imageUrlMap[p.num]
        const categoryId = categoryMap[p.category]

        return {
          title: p.name,
          handle: `medpharma-${p.num}-${slugify(p.manufacturer || "product")}`,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfileId,
          ...(categoryId ? { category_ids: [categoryId] } : {}),
          ...(imageUrl
            ? {
                images: [{ url: imageUrl }],
                thumbnail: imageUrl,
              }
            : {}),
          options: [
            {
              title: "Default",
              values: ["Standard"],
            },
          ],
          variants: [
            {
              title: "Standard",
              sku: generateSku(p),
              options: { Default: "Standard" },
              prices: [
                {
                  amount: priceInTetri,
                  currency_code: "gel",
                },
              ],
              manage_inventory: false,
            },
          ],
          sales_channels: [{ id: salesChannelId }],
        }
      })

    if (productsInput.length === 0) {
      skipped += batch.length
      continue
    }

    try {
      const { result } = await createProductsWorkflow(container).run({
        input: { products: productsInput },
      })

      // Link product extensions and brands
      const productExtService = container.resolve(
        "productExtension"
      ) as any

      for (let j = 0; j < result.length; j++) {
        const medusaProduct = result[j]
        const rawProduct = batch[j]
        if (!medusaProduct || !rawProduct) continue

        // Create product extension
        try {
          const extension = await productExtService.createProductExtensions({
            name_ka: rawProduct.name,
            name_en: null,
            description_ka: null,
            description_en: null,
            is_sugar_free: rawProduct.is_sugar_free || false,
            is_low_protein: rawProduct.is_low_protein || false,
            is_diabetic_friendly: rawProduct.is_diabetic_friendly || false,
            is_gluten_free: rawProduct.is_gluten_free || false,
            product_type: rawProduct.category === "low-protein-pku"
              ? "SPECIAL_FOOD"
              : rawProduct.category === "sugar-substitutes"
                ? "SUPPLEMENT"
                : "OTHER",
            manufacturer_country: rawProduct.country || null,
            weight: null,
            unit: null,
          })

          // Link extension to product
          await link.create({
            [Modules.PRODUCT]: { product_id: medusaProduct.id },
            productExtension: {
              product_extension_id: extension.id,
            },
          })
        } catch (e: any) {
          logger.warn(
            `  Failed to create extension for #${rawProduct.num}: ${e.message}`
          )
        }

        // Link brand
        const brandSlug =
          mfrToBrandSlug[rawProduct.manufacturer] ||
          mfrToBrandSlug[
            Object.keys(mfrToBrandSlug).find((k) =>
              rawProduct.manufacturer?.toLowerCase().includes(k.toLowerCase())
            ) || ""
          ]

        if (brandSlug && brandMap[brandSlug]) {
          try {
            await link.create({
              [Modules.PRODUCT]: { product_id: medusaProduct.id },
              brand: { brand_id: brandMap[brandSlug] },
            })
          } catch (e: any) {
            logger.warn(
              `  Failed to link brand for #${rawProduct.num}: ${e.message}`
            )
          }
        }
      }

      created += result.length
      logger.info(`  Created ${created}/${rawProducts.length} products...`)
    } catch (e: any) {
      logger.error(`  Batch failed: ${e.message}`)
      skipped += batch.length
    }
  }

  // ── Step 6: Create category extensions (custom bilingual categories) ──
  logger.info("Creating category extensions...")
  const categoryExtService = container.resolve(
    "categoryExtension"
  ) as any

  const categoryExtData = [
    {
      name_ka: "შაქრის შემცვლელები",
      name_en: "Sugar Substitutes",
      slug: "sugar-substitutes",
      sort_order: 1,
    },
    {
      name_ka: "ციკორის ყავა",
      name_en: "Chicory Coffee",
      slug: "chicory-coffee",
      sort_order: 2,
    },
    {
      name_ka: "უშაქრო სნეკები",
      name_en: "Sugar-Free Snacks",
      slug: "sugar-free-snacks",
      sort_order: 3,
    },
    {
      name_ka: "დაბალცილებიანი (PKU)",
      name_en: "Low Protein (PKU)",
      slug: "low-protein-pku",
      sort_order: 4,
    },
  ]

  for (const cat of categoryExtData) {
    try {
      const existing = await categoryExtService.listCategoryExtensions({
        slug: cat.slug,
      })
      if (!existing?.length) {
        await categoryExtService.createCategoryExtensions({
          ...cat,
          is_active: true,
        })
        logger.info(`  Created category extension: ${cat.name_en}`)
      } else {
        logger.info(`  Category extension "${cat.name_en}" already exists`)
      }
    } catch (e: any) {
      logger.warn(`  Failed to create category extension: ${e.message}`)
    }
  }

  // ── Done ──
  logger.info("═══════════════════════════════════════")
  logger.info(`Import complete!`)
  logger.info(`  Created: ${created} products`)
  logger.info(`  Skipped: ${skipped} products`)
  logger.info(`  Images: ${Object.keys(imageUrlMap).length} uploaded`)
  logger.info(`  Brands: ${Object.keys(brandMap).length} created`)
  logger.info("═══════════════════════════════════════")
}
