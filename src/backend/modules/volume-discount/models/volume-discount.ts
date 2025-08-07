import { Entity, PrimaryKey, Property, Index } from "@mikro-orm/core"
import { BaseEntity } from "@medusajs/framework/utils"

/**
 * Volume discount tier configuration for products
 */
@Entity({ tableName: "volume_discount" })
export default class VolumeDiscount extends BaseEntity {
  @PrimaryKey({ columnType: "text" })
  id!: string

  /**
   * Type of discount: global, products, categories
   */
  @Property({ columnType: "text", default: "products" })
  @Index()
  discount_type: "global" | "products" | "categories" = "products"


  /**
   * Category IDs this discount applies to (JSON array)
   */
  @Property({ columnType: "jsonb", nullable: true })
  category_ids?: string[] | null

  /**
   * Product IDs to exclude from global/category discounts (JSON array)
   */
  @Property({ columnType: "jsonb", nullable: true })
  excluded_product_ids?: string[] | null

  /**
   * Minimum quantity for this discount tier
   */
  @Property({ columnType: "integer" })
  min_quantity: number

  /**
   * Maximum quantity for this discount tier (null means unlimited)
   */
  @Property({ columnType: "integer", nullable: true })
  max_quantity?: number | null

  /**
   * Discount percentage (e.g., 10 for 10% discount)
   */
  @Property({ columnType: "decimal", precision: 5, scale: 2, nullable: true })
  discount_percentage?: number

  /**
   * Display title for this tier (e.g., "Descuento por volumen")
   */
  @Property({ columnType: "text" })
  title: string

  /**
   * Optional description for this discount tier
   */
  @Property({ columnType: "text", nullable: true })
  description?: string | null

  /**
   * Whether this discount tier is active
   */
  @Property({ columnType: "boolean", default: true })
  is_active: boolean = true

  /**
   * Priority order for display (higher numbers = higher priority)
   */
  @Property({ columnType: "integer", default: 0 })
  priority: number = 0

  /**
   * Start date for the discount validity
   */
  @Property({ columnType: "timestamp", nullable: true })
  valid_from?: Date | null

  /**
   * End date for the discount validity
   */
  @Property({ columnType: "timestamp", nullable: true })
  valid_until?: Date | null

  /**
   * Maximum number of times this discount can be used (null = unlimited)
   */
  @Property({ columnType: "integer", nullable: true })
  usage_limit?: number | null

  /**
   * Current usage count
   */
  @Property({ columnType: "integer", default: 0 })
  usage_count: number = 0

  /**
   * Maximum uses per customer (null = unlimited)
   */
  @Property({ columnType: "integer", nullable: true })
  usage_limit_per_customer?: number | null

  /**
   * Type of discount value: percentage or fixed
   */
  @Property({ columnType: "text", default: "percentage" })
  discount_value_type: "percentage" | "fixed" = "percentage"

  /**
   * Fixed discount amount (when discount_value_type is "fixed")
   */
  @Property({ columnType: "decimal", precision: 10, scale: 2, nullable: true })
  discount_fixed_amount?: number | null
}

export type CreateVolumeDiscountInput = {
  discount_type?: "global" | "products" | "categories"
  product_ids?: string[]
  category_ids?: string[]
  excluded_product_ids?: string[]
  min_quantity: number
  max_quantity?: number | null
  discount_percentage?: number
  discount_value_type?: "percentage" | "fixed"
  discount_fixed_amount?: number
  title: string
  description?: string | null
  is_active?: boolean
  priority?: number
  valid_from?: Date | null
  valid_until?: Date | null
  usage_limit?: number | null
  usage_limit_per_customer?: number | null
}

export type UpdateVolumeDiscountInput = Partial<CreateVolumeDiscountInput> & {
  id: string
}