import { Migration } from "@mikro-orm/migrations"

export class Migration20250807000000 extends Migration {
  async up(): Promise<void> {
    // Make product_id nullable to support global discounts
    this.addSql(`
      ALTER TABLE volume_discount 
      ALTER COLUMN product_id DROP NOT NULL;
    `)
  }

  async down(): Promise<void> {
    // Remove global discounts before making product_id required again
    this.addSql(`
      DELETE FROM volume_discount WHERE product_id IS NULL;
    `)
    
    this.addSql(`
      ALTER TABLE volume_discount 
      ALTER COLUMN product_id SET NOT NULL;
    `)
  }
}