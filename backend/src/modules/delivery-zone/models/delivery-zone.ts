import { model } from "@medusajs/framework/utils"

const DeliveryZone = model.define("delivery_zone", {
  id: model.id().primaryKey(),

  // Bilingual names
  name_ka: model.text().searchable(),
  name_en: model.text().searchable().nullable(),

  // Delivery fee
  fee: model.bigNumber().default(0),

  // Status and ordering
  is_active: model.boolean().default(true),
  sort_order: model.number().default(0),
})

export default DeliveryZone
