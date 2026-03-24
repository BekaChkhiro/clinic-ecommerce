import { model } from "@medusajs/framework/utils"

const Branch = model.define("branch", {
  id: model.id().primaryKey(),

  // Bilingual names
  name_ka: model.text().searchable(),
  name_en: model.text().searchable().nullable(),

  // Bilingual address
  address_ka: model.text(),
  address_en: model.text().nullable(),

  // Contact
  phone: model.text().nullable(),

  // Working hours (JSON stored as text)
  // Format: {"weekdays":{"open":"09:00","close":"20:00"},"saturday":{"open":"10:00","close":"18:00"},"sunday":null}
  working_hours: model.text().nullable(),

  // Delivery info
  delivery_info_ka: model.text().nullable(),
  delivery_info_en: model.text().nullable(),

  // Coordinates (JSON stored as text)
  // Format: {"lat":41.7151,"lng":44.8271}
  coordinates: model.text().nullable(),

  // Status and ordering
  is_active: model.boolean().default(true),
  sort_order: model.number().default(0),
})

export default Branch
