import { Module } from "@medusajs/framework/utils"
import BranchModuleService from "./service"

export const BRANCH_MODULE = "branch"

export default Module(BRANCH_MODULE, {
  service: BranchModuleService,
})
