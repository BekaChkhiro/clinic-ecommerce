import { ExecArgs } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

export default async function createApiKey({ container }: ExecArgs) {
  const apiKeyService = container.resolve(Modules.API_KEY)
  const userService = container.resolve(Modules.USER)

  try {
    // Get admin user
    const [adminUser] = await userService.listUsers({
      email: "superadmin@medpharma.ge"
    })

    if (!adminUser) {
      console.log("Admin user not found!")
      return
    }

    // Create publishable API key
    const apiKey = await apiKeyService.createApiKeys({
      title: "Storefront Key",
      type: "publishable",
      created_by: adminUser.id,
    })

    console.log("\n✅ Publishable API Key შეიქმნა!")
    console.log(`   ID: ${apiKey.id}`)
    console.log(`   Token: ${apiKey.token}`)
    console.log(`\n   დაამატე .env.local-ში:`)
    console.log(`   NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=${apiKey.token}`)

  } catch (e: any) {
    console.error("Error:", e.message || e)
  }
}
