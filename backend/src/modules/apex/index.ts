import { Module } from "@medusajs/framework/utils"
import ApexModuleService from "./service"

export const APEX_MODULE = "apex"

export default Module(APEX_MODULE, {
  service: ApexModuleService,
})
