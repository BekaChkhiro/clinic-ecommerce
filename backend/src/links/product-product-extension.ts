import { defineLink } from "@medusajs/framework/utils"
import ProductModule from "@medusajs/medusa/product"
import ProductExtensionModule from "../modules/product-extension"

export default defineLink(
  ProductModule.linkable.product,
  {
    linkable: ProductExtensionModule.linkable.productExtension,
    isList: false,
  }
)
