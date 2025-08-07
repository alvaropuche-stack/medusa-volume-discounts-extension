import { Entity, PrimaryKey, Property, Index } from "@mikro-orm/core"
import { BaseEntity } from "@medusajs/framework/utils"

/**
 * Relationship between volume discounts and products
 * Allows a volume discount to apply to multiple products
 */
@Entity({ tableName: "volume_discount_product" })
export default class VolumeDiscountProduct extends BaseEntity {
  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text" })
  @Index()
  volume_discount_id: string

  @Property({ columnType: "text" })
  @Index()
  product_id: string
}

export type CreateVolumeDiscountProductInput = {
  volume_discount_id: string
  product_id: string
}