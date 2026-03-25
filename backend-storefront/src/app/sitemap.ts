import type { MetadataRoute } from "next"
import { getBaseURL } from "@lib/util/env"
import { listProducts } from "@lib/data/products"
import { listCategories } from "@lib/data/categories"
import { listRegions } from "@lib/data/regions"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseURL()

  const regions = await listRegions().catch(() => [])
  const countryCodes = regions
    ?.flatMap((r) => r.countries?.map((c) => c.iso_2))
    .filter(Boolean) as string[]

  const defaultCountry = countryCodes[0] || "ge"

  // Static pages
  const staticPages = ["", "/store"].map((path) => ({
    url: `${baseUrl}/${defaultCountry}${path}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: path === "" ? 1.0 : 0.8,
    alternates: {
      languages: Object.fromEntries(
        countryCodes.map((cc) => [cc, `${baseUrl}/${cc}${path}`])
      ),
    },
  }))

  // Product pages
  let productEntries: MetadataRoute.Sitemap = []
  try {
    const { response } = await listProducts({
      countryCode: defaultCountry,
      queryParams: { limit: 1000, fields: "handle,updated_at" },
    })

    productEntries = response.products
      .filter((p) => p.handle)
      .map((product) => ({
        url: `${baseUrl}/${defaultCountry}/products/${product.handle}`,
        lastModified: product.updated_at
          ? new Date(product.updated_at)
          : new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
        alternates: {
          languages: Object.fromEntries(
            countryCodes.map((cc) => [
              cc,
              `${baseUrl}/${cc}/products/${product.handle}`,
            ])
          ),
        },
      }))
  } catch (e) {
    console.error("Sitemap: failed to fetch products", e)
  }

  // Category pages
  let categoryEntries: MetadataRoute.Sitemap = []
  try {
    const categories = await listCategories()
    if (categories) {
      categoryEntries = categories
        .filter((c: any) => c.handle)
        .map((category: any) => ({
          url: `${baseUrl}/${defaultCountry}/categories/${category.handle}`,
          lastModified: new Date(),
          changeFrequency: "weekly" as const,
          priority: 0.6,
          alternates: {
            languages: Object.fromEntries(
              countryCodes.map((cc) => [
                cc,
                `${baseUrl}/${cc}/categories/${category.handle}`,
              ])
            ),
          },
        }))
    }
  } catch (e) {
    console.error("Sitemap: failed to fetch categories", e)
  }

  return [...staticPages, ...productEntries, ...categoryEntries]
}
