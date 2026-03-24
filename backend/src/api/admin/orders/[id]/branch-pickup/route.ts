import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { BRANCH_MODULE } from "../../../../../modules/branch"

// GET /admin/orders/:id/branch-pickup - Get branch pickup info for an order
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id } = req.params

  try {
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

    const { data } = await query.graph({
      entity: "order",
      fields: ["id", "display_id", "branch.*"],
      filters: { id },
    })

    if (!data.length) {
      return res.status(404).json({ message: `Order ${id} not found` })
    }

    const order = data[0] as any
    const branch = order.branch || null

    res.json({
      order_id: order.id,
      display_id: order.display_id,
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

// DELETE /admin/orders/:id/branch-pickup - Remove branch pickup from order
export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id } = req.params

  try {
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
    const remoteLink = req.scope.resolve(ContainerRegistrationKeys.REMOTE_LINK)

    const { data } = await query.graph({
      entity: "order",
      fields: ["id", "branch.*"],
      filters: { id },
    })

    if (!data.length) {
      return res.status(404).json({ message: `Order ${id} not found` })
    }

    const order = data[0] as any

    if (!order.branch) {
      return res.status(400).json({ message: "Order has no branch pickup set" })
    }

    await remoteLink.dismiss({
      [Modules.ORDER]: { order_id: id },
      [BRANCH_MODULE]: { branch_id: order.branch.id },
    })

    res.json({
      order_id: id,
      is_pickup: false,
      message: "Branch pickup removed",
    })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}
