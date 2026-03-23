import { ExecArgs } from "@medusajs/framework/types"
import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils"

export default async function linkApiKey({ container }: ExecArgs) {
  const apiKeyService = container.resolve(Modules.API_KEY)
  const salesChannelService = container.resolve(Modules.SALES_CHANNEL)
  const link = container.resolve(ContainerRegistrationKeys.LINK)

  try {
    // List API keys
    const apiKeys = await apiKeyService.listApiKeys({ type: "publishable" })
    console.log("API Keys found:", apiKeys.length)

    if (apiKeys.length === 0) {
      console.log("No publishable API keys found!")
      return
    }

    const apiKey = apiKeys[0]
    console.log(`Using API Key: ${apiKey.id} (${apiKey.title})`)

    // List or create sales channel
    let salesChannels = await salesChannelService.listSalesChannels({})

    if (salesChannels.length === 0) {
      // Create default sales channel
      const newChannel = await salesChannelService.createSalesChannels({
        name: "MedPharma Store",
        description: "Default storefront sales channel",
      })
      salesChannels = [newChannel]
      console.log(`Created sales channel: ${newChannel.id}`)
    }

    const salesChannel = salesChannels[0]
    console.log(`Using Sales Channel: ${salesChannel.id} (${salesChannel.name})`)

    // Link API key to sales channel
    await link.create({
      [Modules.API_KEY]: {
        api_key_id: apiKey.id,
      },
      [Modules.SALES_CHANNEL]: {
        sales_channel_id: salesChannel.id,
      },
    })

    console.log("\n✅ API Key დაუკავშირდა Sales Channel-ს!")
    console.log(`   API Key: ${apiKey.token}`)
    console.log(`   Sales Channel: ${salesChannel.name}`)

  } catch (e: any) {
    if (e.message?.includes("already exists")) {
      console.log("Link already exists!")
    } else {
      console.error("Error:", e.message || e)
    }
  }
}
