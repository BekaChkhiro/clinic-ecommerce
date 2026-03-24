import { Module } from "@medusajs/framework/utils"
import CategoryExtensionModuleService from "./service"

export const CATEGORY_EXTENSION_MODULE = "categoryExtension"

export default Module(CATEGORY_EXTENSION_MODULE, {
  service: CategoryExtensionModuleService,
})
