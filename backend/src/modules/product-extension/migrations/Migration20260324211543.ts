import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260324211543 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "product_extension" ("id" text not null, "name_ka" text not null, "name_en" text null, "description_ka" text null, "description_en" text null, "is_sugar_free" boolean not null default false, "is_low_protein" boolean not null default false, "is_diabetic_friendly" boolean not null default false, "is_gluten_free" boolean not null default false, "product_type" text check ("product_type" in ('SUPPLEMENT', 'SPECIAL_FOOD', 'MEDICATION', 'COSMETIC', 'DEVICE', 'OTHER')) not null default 'OTHER', "manufacturer_country" text null, "weight" text null, "unit" text null, "apex_id" text null, "meta_title_ka" text null, "meta_title_en" text null, "meta_description_ka" text null, "meta_description_en" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "product_extension_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_product_extension_deleted_at" ON "product_extension" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "product_extension" cascade;`);
  }

}
