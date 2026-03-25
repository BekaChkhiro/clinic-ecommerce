import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export default async function checkImport({ container }: ExecArgs) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

  // 1. Products count
  const { data: products } = await query.graph({
    entity: "product",
    fields: ["id", "title", "handle", "thumbnail"],
  })
  logger.info(`\n=== Products: ${products.length} ===`)
  for (const p of products.slice(0, 3)) {
    logger.info(`  ${p.handle} | ${p.title} | img: ${p.thumbnail ? "YES" : "NO"}`)
  }

  // 2. Product Extensions
  const { data: extensions } = await query.graph({
    entity: "product_extension",
    fields: [
      "id", "name_ka", "is_sugar_free", "is_low_protein",
      "is_diabetic_friendly", "is_gluten_free", "product_type",
      "manufacturer_country",
    ],
  })
  logger.info(`\n=== Product Extensions: ${extensions.length} ===`)
  const sugarFree = extensions.filter((e: any) => e.is_sugar_free).length
  const lowProtein = extensions.filter((e: any) => e.is_low_protein).length
  const diabetic = extensions.filter((e: any) => e.is_diabetic_friendly).length
  logger.info(`  Sugar-free: ${sugarFree}`)
  logger.info(`  Low protein (PKU): ${lowProtein}`)
  logger.info(`  Diabetic friendly: ${diabetic}`)
  const types: Record<string, number> = {}
  for (const e of extensions) {
    types[(e as any).product_type] = (types[(e as any).product_type] || 0) + 1
  }
  logger.info(`  Product types: ${JSON.stringify(types)}`)
  for (const e of extensions.slice(0, 2)) {
    logger.info(`  Sample: ${(e as any).name_ka} | country: ${(e as any).manufacturer_country} | type: ${(e as any).product_type}`)
  }

  // 3. Brands
  const { data: brands } = await query.graph({
    entity: "brand",
    fields: ["id", "name_ka", "name_en", "slug", "country"],
  })
  logger.info(`\n=== Brands: ${brands.length} ===`)
  for (const b of brands) {
    logger.info(`  ${(b as any).name_en} (${(b as any).slug}) - ${(b as any).country}`)
  }

  // 4. Category Extensions
  const { data: catExts } = await query.graph({
    entity: "category_extension",
    fields: ["id", "name_ka", "name_en", "slug"],
  })
  logger.info(`\n=== Category Extensions: ${catExts.length} ===`)
  for (const c of catExts) {
    logger.info(`  ${(c as any).name_en} (${(c as any).slug}) | ${(c as any).name_ka}`)
  }

  // 5. Product Categories (Medusa built-in)
  const { data: categories } = await query.graph({
    entity: "product_category",
    fields: ["id", "name", "handle"],
  })
  logger.info(`\n=== Medusa Categories: ${categories.length} ===`)
  for (const c of categories) {
    logger.info(`  ${(c as any).name} (${(c as any).handle})`)
  }

  // 6. Check product-extension links
  const { data: linkedProducts } = await query.graph({
    entity: "product",
    fields: ["id", "title", "product_extension.*"],
  })
  const withExt = linkedProducts.filter((p: any) => p.product_extension)
  logger.info(`\n=== Product-Extension Links: ${withExt.length}/${products.length} ===`)
  if (withExt.length > 0) {
    const sample = withExt[0] as any
    logger.info(`  Sample: "${sample.title}" -> ext: ${sample.product_extension?.name_ka || "N/A"}`)
  }

  // 7. Check product-brand links
  const { data: brandLinked } = await query.graph({
    entity: "product",
    fields: ["id", "title", "brand.*"],
  })
  const withBrand = brandLinked.filter((p: any) => p.brand)
  logger.info(`\n=== Product-Brand Links: ${withBrand.length}/${products.length} ===`)
  if (withBrand.length > 0) {
    const sample = withBrand[0] as any
    logger.info(`  Sample: "${sample.title}" -> brand: ${sample.brand?.name_en || "N/A"}`)
  }

  // 8. Prices
  const { data: variants } = await query.graph({
    entity: "product_variant",
    fields: ["id", "sku", "calculated_price.*"],
  })
  logger.info(`\n=== Variants: ${variants.length} ===`)

  logger.info("\n═══════════════════════════════════════")
  logger.info("Import verification complete!")
  logger.info("═══════════════════════════════════════")
}
