import { Entity, PrimaryKey, Property, Index, ManyToOne } from "@mikro-orm/core"
import { BaseEntity } from "@medusajs/framework/utils"
import VolumeDiscount from "./volume-discount"

/**
 * Product exclusions for global volume discounts
 */
@Entity({ tableName: "volume_discount_exclusion" })
export default class VolumeDiscountExclusion extends BaseEntity {
  @PrimaryKey({ columnType: "text" })
  id: string

  /**
   * The global volume discount this exclusion applies to
   */
  @ManyToOne(() => VolumeDiscount, { 
    columnType: "text",
    onDelete: "CASCADE"
  })
  @Index()
  volume_discount: VolumeDiscount

  /**
   * The product ID to exclude from this global discount
   */
  @Property({ columnType: "text" })
  @Index()
  product_id: string
}

export type CreateVolumeDiscountExclusionInput = {
  volume_discount_id: string
  product_id: string
}