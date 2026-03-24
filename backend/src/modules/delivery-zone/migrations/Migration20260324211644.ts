import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260324211644 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "delivery_zone" ("id" text not null, "name_ka" text not null, "name_en" text null, "fee" numeric not null default 0, "is_active" boolean not null default true, "sort_order" integer not null default 0, "raw_fee" jsonb not null default '{"value":"0","precision":20}', "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "delivery_zone_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_delivery_zone_deleted_at" ON "delivery_zone" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "delivery_zone" cascade;`);
  }

}
