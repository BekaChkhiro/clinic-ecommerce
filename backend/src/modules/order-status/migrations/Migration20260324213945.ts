import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260324213945 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "custom_order_status" ("id" text not null, "status" text check ("status" in ('PENDING', 'CONFIRMED', 'PACKED', 'COURIER_ASSIGNED', 'SHIPPED', 'DELIVERED', 'CANCELLED')) not null default 'PENDING', "previous_status" text null, "courier_name" text null, "courier_phone" text null, "cancellation_reason" text null, "notes" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "custom_order_status_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_custom_order_status_deleted_at" ON "custom_order_status" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "custom_order_status" cascade;`);
  }

}
