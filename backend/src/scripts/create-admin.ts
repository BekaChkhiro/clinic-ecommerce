import { ExecArgs } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

export default async function createAdmin({ container }: ExecArgs) {
  const email = "admin@medpharma.ge"
  const password = "Admin123!"

  try {
    const userService = container.resolve(Modules.USER)
    const authService = container.resolve(Modules.AUTH)

    // Create user
    const user = await userService.createUsers({
      email,
      first_name: "Admin",
      last_name: "MedPharma",
    })

    // Create auth identity with password
    await authService.createAuthIdentities({
      provider_identities: [
        {
          provider: "emailpass",
          entity_id: email,
          provider_metadata: {},
          auth_identity_id: undefined as any,
        },
      ],
      app_metadata: {
        user_id: user.id,
      },
    })

    // Register with email/password provider
    await authService.register("emailpass", {
      body: { email, password },
    } as any)

    // Update auth identity with user_id
    const [authIdentity] = await authService.listAuthIdentities({
      provider_identities: { entity_id: email },
    })

    if (authIdentity) {
      await authService.updateAuthIdentities({
        id: authIdentity.id,
        app_metadata: { user_id: user.id },
      })
    }

    console.log("\n✅ Admin user created!")
    console.log(`   Email: ${email}`)
    console.log(`   Password: ${password}`)
    console.log(`\n   Login at: https://backend-production-6d6f.up.railway.app/app`)

  } catch (e: any) {
    console.error("Error:", e.message || e)
  }
}
