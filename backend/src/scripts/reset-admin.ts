import { ExecArgs } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

export default async function resetAdmin({ container }: ExecArgs) {
  const userService = container.resolve(Modules.USER)
  const authService = container.resolve(Modules.AUTH)

  const email = "admin@medpharma.ge"
  const password = "Admin123!"

  // Step 1: Delete existing auth identities
  try {
    const authIdentities = await authService.listAuthIdentities({
      provider_identities: {
        entity_id: email,
      },
    })

    if (authIdentities && authIdentities.length > 0) {
      for (const identity of authIdentities) {
        await authService.deleteAuthIdentities([identity.id])
        console.log(`Deleted auth identity: ${identity.id}`)
      }
    }
  } catch (e) {
    console.log("Error deleting auth identities:", e)
  }

  // Step 2: Delete existing user
  try {
    const [existingUser] = await userService.listUsers({ email })
    if (existingUser) {
      await userService.deleteUsers([existingUser.id])
      console.log(`Deleted user: ${existingUser.id}`)
    }
  } catch (e) {
    console.log("No existing user found")
  }

  // Step 3: Create fresh user and auth identity
  try {
    const user = await userService.createUsers({
      email,
      first_name: "Admin",
      last_name: "MedPharma",
    })
    console.log(`Created user: ${user.id}`)

    const authIdentity = await authService.createAuthIdentities({
      provider_identities: [
        {
          provider: "emailpass",
          entity_id: email,
          provider_metadata: {
            password,
          },
        },
      ],
      app_metadata: {
        user_id: user.id,
      },
    })
    console.log(`Created auth identity: ${authIdentity.id}`)

    console.log("\n✅ Admin user created successfully!")
    console.log(`   Email: ${email}`)
    console.log(`   Password: ${password}`)

  } catch (e) {
    console.error("Error creating user:", e)
  }
}
