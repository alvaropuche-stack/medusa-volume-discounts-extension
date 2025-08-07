import { Migration } from '@mikro-orm/migrations';

export class Migration20250806120000 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "volume_discount" ("id" text not null, "product_id" text not null, "min_quantity" integer not null, "max_quantity" integer null, "discount_percentage" decimal(5,2) not null, "title" text not null, "description" text null, "is_active" boolean not null default true, "priority" integer not null default 0, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "volume_discount_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_volume_discount_product_id" ON "volume_discount" ("product_id");`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_volume_discount_deleted_at" ON "volume_discount" (deleted_at) WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "volume_discount" cascade;`);
  }

}