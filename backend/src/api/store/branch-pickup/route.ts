import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { BRANCH_MODULE } from "../../../modules/branch"
import type BranchModuleService from "../../../modules/branch/service"

// POST /store/branch-pickup - Set branch pickup on an order
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const { order_id, branch_id } = req.body as {
    order_id: string
    branch_id: string
  }

  if (!order_id || !branch_id) {
    return res.status(400).json({
      message: "order_id and branch_id are required",
    })
  }

  try {
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
    const remoteLink = req.scope.resolve(ContainerRegistrationKeys.REMOTE_LINK)
    const branchService = req.scope.resolve<BranchModuleService>(BRANCH_MODULE)

    // Verify branch exists and is active
    const branch = await branchService.retrieveBranch(branch_id)
    if (!branch || !branch.is_active) {
      return res.status(404).json({ message: "Branch not found or inactive" })
    }

    // Verify order exists
    const { data: orders } = await query.graph({
      entity: "order",
      fields: ["id", "branch.*"],
      filters: { id: order_id },
    })

    if (!orders.length) {
      return res.status(404).json({ message: `Order ${order_id} not found` })
    }

    const order = orders[0] as any

    // If order already has a branch linked, dismiss the old link first
    if (order.branch) {
      await remoteLink.dismiss({
        [Modules.ORDER]: { order_id },
        [BRANCH_MODULE]: { branch_id: order.branch.id },
      })
    }

    // Create the link between order and branch
    await remoteLink.create({
      [Modules.ORDER]: { order_id },
      [BRANCH_MODULE]: { branch_id },
    })

    res.status(201).json({
      order_id,
      branch: {
        id: branch.id,
        name_ka: branch.name_ka,
        name_en: branch.name_en,
        address_ka: branch.address_ka,
        address_en: branch.address_en,
        phone: branch.phone,
        working_hours: branch.working_hours,
      },
      is_pickup: true,
      delivery_fee: 0,
      message: "Branch pickup set successfully",
    })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

// GET /store/branch-pickup?order_id=xxx - Get branch pickup info for an order
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const order_id = req.query.order_id as string

  if (!order_id) {
    return res.status(400).json({ message: "order_id query parameter is required" })
  }

  try {
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

    const { data } = await query.graph({
      entity: "order",
      fields: ["id", "branch.*"],
      filters: { id: order_id },
    })

    if (!data.length) {
      return res.status(404).json({ message: `Order ${order_id} not found` })
    }

    const order = data[0] as any
    const branch = order.branch || null

    res.json({
      order_id,
      is_pickup: !!branch,
      delivery_fee: branch ? 0 : null,
      branch: branch
        ? {
            id: branch.id,
            name_ka: branch.name_ka,
            name_en: branch.name_en,
            address_ka: branch.address_ka,
            address_en: branch.address_en,
            phone: branch.phone,
            working_hours: branch.working_hours,
            coordinates: branch.coordinates,
          }
        : null,
    })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}
