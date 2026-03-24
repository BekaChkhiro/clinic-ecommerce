import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260324213554 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "page" ("id" text not null, "slug" text not null, "title_ka" text not null, "title_en" text null, "content_ka" text not null, "content_en" text null, "meta_title_ka" text null, "meta_title_en" text null, "meta_description_ka" text null, "meta_description_en" text null, "is_active" boolean not null default true, "sort_order" integer not null default 0, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "page_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_page_deleted_at" ON "page" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "page" cascade;`);
  }

}
