import { MedusaService } from "@medusajs/framework/utils"
import Branch from "./models/branch"

class BranchModuleService extends MedusaService({
  Branch,
}) {}

export default BranchModuleService
