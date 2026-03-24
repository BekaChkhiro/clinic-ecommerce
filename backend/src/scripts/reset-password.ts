import { ExecArgs } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

export default async function resetPassword({ container }: ExecArgs) {
  const email = "admin@medpharma.ge"
  const password = "Admin123!"

  try {
    const authService = container.resolve(Modules.AUTH)

    // Try to update existing auth or create new one
    const result = await authService.authenticate("emailpass", {
      body: { email, password },
    } as any)

    if (result.success) {
      console.log("\n✅ Login works! Use these credentials:")
      console.log(`   Email: ${email}`)
      console.log(`   Password: ${password}`)
      return
    }

    // If auth fails, try registering
    const registerResult = await authService.register("emailpass", {
      body: { email, password },
    } as any)

    if (registerResult.success) {
      // Link to existing user
      const userService = container.resolve(Modules.USER)
      const [user] = await userService.listUsers({ email })

      if (user && registerResult.authIdentity) {
        await authService.updateAuthIdentities({
          id: registerResult.authIdentity.id,
          app_metadata: { user_id: user.id },
        })
      }

      console.log("\n✅ Auth created and linked!")
      console.log(`   Email: ${email}`)
      console.log(`   Password: ${password}`)
    } else {
      console.log("Register result:", registerResult)
    }

  } catch (e: any) {
    console.error("Error:", e.message || e)
  }
}
