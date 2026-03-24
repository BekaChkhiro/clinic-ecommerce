import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260325220000 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "category_extension" ("id" text not null, "name_ka" text not null, "name_en" text null, "slug" text not null, "description_ka" text null, "description_en" text null, "image" text null, "parent_id" text null, "sort_order" integer not null default 0, "is_active" boolean not null default true, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "category_extension_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_category_extension_slug_unique" ON "category_extension" ("slug") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_category_extension_parent_id" ON "category_extension" ("parent_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_category_extension_deleted_at" ON "category_extension" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "category_extension" cascade;`);
  }

}
