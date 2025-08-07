import { Migration } from "@mikro-orm/migrations"

export class Migration20250807100000 extends Migration {
  async up(): Promise<void> {
    // Create volume_discount_product table for many-to-many relationship
    this.addSql(`
      CREATE TABLE IF NOT EXISTS volume_discount_product (
        id TEXT PRIMARY KEY,
        volume_discount_id TEXT NOT NULL,
        product_id TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP,
        CONSTRAINT fk_volume_discount FOREIGN KEY (volume_discount_id) 
          REFERENCES volume_discount(id) ON DELETE CASCADE
      );
    `)
    
    // Add indexes
    this.addSql(`CREATE INDEX idx_vdp_volume_discount_id ON volume_discount_product(volume_discount_id);`)
    this.addSql(`CREATE INDEX idx_vdp_product_id ON volume_discount_product(product_id);`)
    this.addSql(`CREATE UNIQUE INDEX idx_vdp_unique ON volume_discount_product(volume_discount_id, product_id) WHERE deleted_at IS NULL;`)

    // Add new columns to volume_discount table
    this.addSql(`ALTER TABLE volume_discount ADD COLUMN discount_type TEXT DEFAULT 'products';`)
    this.addSql(`ALTER TABLE volume_discount ADD COLUMN category_ids JSONB;`)
    this.addSql(`ALTER TABLE volume_discount ADD COLUMN excluded_product_ids JSONB;`)
    this.addSql(`ALTER TABLE volume_discount ADD COLUMN valid_from TIMESTAMP;`)
    this.addSql(`ALTER TABLE volume_discount ADD COLUMN valid_until TIMESTAMP;`)
    this.addSql(`ALTER TABLE volume_discount ADD COLUMN usage_limit INTEGER;`)
    this.addSql(`ALTER TABLE volume_discount ADD COLUMN usage_count INTEGER DEFAULT 0;`)
    this.addSql(`ALTER TABLE volume_discount ADD COLUMN usage_limit_per_customer INTEGER;`)
    this.addSql(`ALTER TABLE volume_discount ADD COLUMN discount_value_type TEXT DEFAULT 'percentage';`)
    this.addSql(`ALTER TABLE volume_discount ADD COLUMN discount_fixed_amount DECIMAL(10,2);`)

    // Migrate existing product_id data to the new structure
    this.addSql(`
      INSERT INTO volume_discount_product (id, volume_discount_id, product_id, created_at, updated_at)
      SELECT 
        'vdp_' || gen_random_uuid()::text,
        id,
        product_id,
        created_at,
        updated_at
      FROM volume_discount
      WHERE product_id IS NOT NULL;
    `)

    // Update discount_type based on existing data
    this.addSql(`
      UPDATE volume_discount 
      SET discount_type = CASE 
        WHEN product_id IS NULL THEN 'global'
        ELSE 'products'
      END;
    `)

    // Drop the old product_id column
    this.addSql(`ALTER TABLE volume_discount DROP COLUMN product_id;`)
  }

  async down(): Promise<void> {
    // Add back product_id column
    this.addSql(`ALTER TABLE volume_discount ADD COLUMN product_id TEXT;`)
    
    // Restore product_id from volume_discount_product (only first one if multiple)
    this.addSql(`
      UPDATE volume_discount vd
      SET product_id = (
        SELECT product_id 
        FROM volume_discount_product vdp 
        WHERE vdp.volume_discount_id = vd.id 
        LIMIT 1
      )
      WHERE discount_type = 'products';
    `)

    // Drop the new columns
    this.addSql(`ALTER TABLE volume_discount DROP COLUMN discount_type;`)
    this.addSql(`ALTER TABLE volume_discount DROP COLUMN category_ids;`)
    this.addSql(`ALTER TABLE volume_discount DROP COLUMN excluded_product_ids;`)
    this.addSql(`ALTER TABLE volume_discount DROP COLUMN valid_from;`)
    this.addSql(`ALTER TABLE volume_discount DROP COLUMN valid_until;`)
    this.addSql(`ALTER TABLE volume_discount DROP COLUMN usage_limit;`)
    this.addSql(`ALTER TABLE volume_discount DROP COLUMN usage_count;`)
    this.addSql(`ALTER TABLE volume_discount DROP COLUMN usage_limit_per_customer;`)
    this.addSql(`ALTER TABLE volume_discount DROP COLUMN discount_value_type;`)
    this.addSql(`ALTER TABLE volume_discount DROP COLUMN discount_fixed_amount;`)

    // Drop the volume_discount_product table
    this.addSql(`DROP TABLE IF EXISTS volume_discount_product;`)
  }
}