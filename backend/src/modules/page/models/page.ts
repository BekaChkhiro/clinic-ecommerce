import { model } from "@medusajs/framework/utils"

const Page = model.define("page", {
  id: model.id().primaryKey(),

  // URL slug
  slug: model.text().searchable(),

  // Bilingual title
  title_ka: model.text().searchable(),
  title_en: model.text().searchable().nullable(),

  // Bilingual content
  content_ka: model.text(),
  content_en: model.text().nullable(),

  // SEO meta fields
  meta_title_ka: model.text().nullable(),
  meta_title_en: model.text().nullable(),
  meta_description_ka: model.text().nullable(),
  meta_description_en: model.text().nullable(),

  // Status
  is_active: model.boolean().default(true),
  sort_order: model.number().default(0),
})

export default Page
