import { model } from "@medusajs/framework/utils"

const ProductExtension = model.define("product_extension", {
  id: model.id().primaryKey(),

  // Bilingual names
  name_ka: model.text().searchable(),
  name_en: model.text().searchable().nullable(),
  description_ka: model.text().nullable(),
  description_en: model.text().nullable(),

  // Dietary tags
  is_sugar_free: model.boolean().default(false),
  is_low_protein: model.boolean().default(false),
  is_diabetic_friendly: model.boolean().default(false),
  is_gluten_free: model.boolean().default(false),

  // Product type (for legal disclaimers)
  product_type: model
    .enum(["SUPPLEMENT", "SPECIAL_FOOD", "MEDICATION", "COSMETIC", "DEVICE", "OTHER"])
    .default("OTHER"),

  // Manufacturer info
  manufacturer_country: model.text().nullable(),

  // Weight and units
  weight: model.text().nullable(),
  unit: model.text().nullable(),

  // APEX ERP integration
  apex_id: model.text().nullable(),

  // SEO fields
  meta_title_ka: model.text().nullable(),
  meta_title_en: model.text().nullable(),
  meta_description_ka: model.text().nullable(),
  meta_description_en: model.text().nullable(),
})

export default ProductExtension
