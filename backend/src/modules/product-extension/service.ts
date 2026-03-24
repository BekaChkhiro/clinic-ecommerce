import { MedusaService } from "@medusajs/framework/utils"
import ProductExtension from "./models/product-extension"

class ProductExtensionModuleService extends MedusaService({
  ProductExtension,
}) {}

export default ProductExtensionModuleService
