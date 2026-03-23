import { ExecArgs } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

export default async function createPublishableKey({ container }: ExecArgs) {
  try {
    const apiKeyService = container.resolve(Modules.API_KEY)

    const apiKey = await apiKeyService.createApiKeys({
      type: "publishable",
      title: "Storefront",
      created_by: "admin",
    })

    console.log("\n✅ Publishable Key შეიქმნა!")
    console.log(`\n   NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=${apiKey.token}`)
    console.log("\n   დაამატე ეს Frontend environment variables-ში\n")

  } catch (error: any) {
    console.error("Error:", error.message || error)
  }
}
