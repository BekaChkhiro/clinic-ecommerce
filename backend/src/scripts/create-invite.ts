import { ExecArgs } from "@medusajs/framework/types"

export default async function createInvite({ container }: ExecArgs) {
  const email = "admin@medpharma.ge"

  try {
    // Get the invite module
    const inviteModuleService = container.resolve("invite") as any

    // Create invite
    const invite = await inviteModuleService.createInvites({
      email,
    })

    console.log("\n✅ Invite created successfully!")
    console.log(`   Email: ${email}`)
    console.log(`   Token: ${invite.token}`)
    console.log(`\n   Use this link to set password:`)
    console.log(`   http://localhost:9000/app/invite?token=${invite.token}`)

  } catch (e: any) {
    console.error("Error:", e.message || e)
  }
}
