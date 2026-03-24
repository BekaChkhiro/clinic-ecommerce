import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260324211754 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "branch" ("id" text not null, "name_ka" text not null, "name_en" text null, "address_ka" text not null, "address_en" text null, "phone" text null, "working_hours" text null, "delivery_info_ka" text null, "delivery_info_en" text null, "coordinates" text null, "is_active" boolean not null default true, "sort_order" integer not null default 0, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "branch_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_branch_deleted_at" ON "branch" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "branch" cascade;`);
  }

}
