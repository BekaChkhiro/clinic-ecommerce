import { defineLink } from "@medusajs/framework/utils"
import OrderModule from "@medusajs/medusa/order"
import BranchModule from "../modules/branch"

export default defineLink(
  OrderModule.linkable.order,
  {
    linkable: BranchModule.linkable.branch,
    isList: false,
  }
)
