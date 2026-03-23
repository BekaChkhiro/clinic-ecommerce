import { ExecArgs } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

export default async function setupStore({ container }: ExecArgs) {
  const regionService = container.resolve(Modules.REGION)
  const storeService = container.resolve(Modules.STORE)

  try {
    // Check if regions exist
    const existingRegions = await regionService.listRegions({})

    if (existingRegions.length > 0) {
      console.log("Regions already exist:")
      existingRegions.forEach(r => console.log(`  - ${r.name} (${r.id})`))
      return
    }

    // Create Georgia region with GEL currency
    const region = await regionService.createRegions({
      name: "Georgia",
      currency_code: "gel",
      countries: ["ge"],
    })

    console.log("\n✅ რეგიონი შეიქმნა!")
    console.log(`   Name: ${region.name}`)
    console.log(`   Currency: GEL`)
    console.log(`   Country: Georgia (GE)`)
    console.log(`   ID: ${region.id}`)

  } catch (e: any) {
    console.error("Error:", e.message || e)
  }
}
