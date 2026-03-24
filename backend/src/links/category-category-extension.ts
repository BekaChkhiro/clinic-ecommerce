import { defineLink } from "@medusajs/framework/utils"
import ProductModule from "@medusajs/medusa/product"
import CategoryExtensionModule from "../modules/category-extension"

export default defineLink(
  ProductModule.linkable.productCategory,
  {
    linkable: CategoryExtensionModule.linkable.categoryExtension,
    isList: false,
  }
)
