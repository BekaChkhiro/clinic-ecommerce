import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import BranchModuleService from "../../../../modules/branch/service"
import { BRANCH_MODULE } from "../../../../modules/branch"

// GET /admin/branches/:id - Get a single branch
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const service = req.scope.resolve<BranchModuleService>(BRANCH_MODULE)

  const branch = await service.retrieveBranch(req.params.id)

  res.json({ branch })
}

// POST /admin/branches/:id - Update a branch
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const service = req.scope.resolve<BranchModuleService>(BRANCH_MODULE)

  const branch = await service.updateBranches({
    id: req.params.id,
    ...(req.body as Record<string, unknown>),
  })

  res.json({ branch })
}

// DELETE /admin/branches/:id - Delete a branch
export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  const service = req.scope.resolve<BranchModuleService>(BRANCH_MODULE)

  await service.deleteBranches(req.params.id)

  res.status(200).json({
    id: req.params.id,
    object: "branch",
    deleted: true,
  })
}
