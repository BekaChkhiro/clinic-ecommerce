import { ExecArgs } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { linkSalesChannelsToApiKeyWorkflow } from "@medusajs/medusa/core-flows"

export default async function fixApiKey({ container }: ExecArgs) {
  const apiKeyService = container.resolve(Modules.API_KEY)
  const salesChannelService = container.resolve(Modules.SALES_CHANNEL)

  try {
    // Get publishable API keys
    const apiKeys = await apiKeyService.listApiKeys({ type: "publishable" })
    console.log(`Found ${apiKeys.length} publishable API keys`)

    // Get sales channels
    const salesChannels = await salesChannelService.listSalesChannels({})
    console.log(`Found ${salesChannels.length} sales channels`)

    if (apiKeys.length === 0 || salesChannels.length === 0) {
      console.log("Missing API keys or sales channels!")
      return
    }

    // Use the workflow to link
    const apiKey = apiKeys.find(k => k.token?.startsWith("pk_0ae")) || apiKeys[0]
    const salesChannel = salesChannels[0]

    console.log(`\nLinking API Key: ${apiKey.id}`)
    console.log(`To Sales Channel: ${salesChannel.id} (${salesChannel.name})`)

    await linkSalesChannelsToApiKeyWorkflow(container).run({
      input: {
        id: apiKey.id,
        add: [salesChannel.id],
      },
    })

    console.log("\n✅ API Key დაუკავშირდა Sales Channel-ს!")

  } catch (e: any) {
    console.error("Error:", e.message || e)

    // Try alternative method
    console.log("\nTrying alternative method...")
    try {
      const apiKeyService = container.resolve(Modules.API_KEY)
      const salesChannelService = container.resolve(Modules.SALES_CHANNEL)

      const apiKeys = await apiKeyService.listApiKeys({ type: "publishable" })
      const salesChannels = await salesChannelService.listSalesChannels({})

      // Update API key with sales channels
      await apiKeyService.upsertApiKeys({
        id: apiKeys[0].id,
        title: apiKeys[0].title,
      })

      console.log("Alternative method completed")
    } catch (e2: any) {
      console.error("Alternative also failed:", e2.message)
    }
  }
}
