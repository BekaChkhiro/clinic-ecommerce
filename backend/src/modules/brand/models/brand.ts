import { model } from "@medusajs/framework/utils"

const Brand = model.define("brand", {
  id: model.id().primaryKey(),

  // Bilingual names
  name_ka: model.text().searchable(),
  name_en: model.text().searchable().nullable(),

  // Brand details
  slug: model.text().unique(),
  country: model.text().nullable(),
  logo: model.text().nullable(),

  // Status and ordering
  is_active: model.boolean().default(true),
  sort_order: model.number().default(0),
})

export default Brand
