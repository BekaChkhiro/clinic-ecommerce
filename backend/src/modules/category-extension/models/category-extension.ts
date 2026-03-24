import { model } from "@medusajs/framework/utils"

const CategoryExtension = model.define("category_extension", {
  id: model.id().primaryKey(),
  name_ka: model.text().searchable(),
  name_en: model.text().searchable().nullable(),
  slug: model.text().unique(),
  description_ka: model.text().nullable(),
  description_en: model.text().nullable(),
  image: model.text().nullable(),
  parent_id: model.text().nullable(),
  sort_order: model.number().default(0),
  is_active: model.boolean().default(true),
})

export default CategoryExtension
