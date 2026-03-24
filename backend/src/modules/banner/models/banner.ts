import { model } from "@medusajs/framework/utils"

const Banner = model.define("banner", {
  id: model.id().primaryKey(),

  // Bilingual content
  title_ka: model.text().searchable().nullable(),
  title_en: model.text().searchable().nullable(),
  subtitle_ka: model.text().nullable(),
  subtitle_en: model.text().nullable(),

  // Images
  image: model.text(),
  image_mobile: model.text().nullable(),

  // Link and CTA
  link: model.text().nullable(),
  button_text_ka: model.text().nullable(),
  button_text_en: model.text().nullable(),

  // Placement
  position: model
    .enum(["homepage", "category", "product"])
    .default("homepage"),

  // Scheduling
  starts_at: model.dateTime().nullable(),
  ends_at: model.dateTime().nullable(),

  // Status and ordering
  is_active: model.boolean().default(true),
  sort_order: model.number().default(0),
})

export default Banner
