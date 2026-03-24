import { MedusaService } from "@medusajs/framework/utils"
import CategoryExtension from "./models/category-extension"

class CategoryExtensionModuleService extends MedusaService({
  CategoryExtension,
}) {}

export default CategoryExtensionModuleService
