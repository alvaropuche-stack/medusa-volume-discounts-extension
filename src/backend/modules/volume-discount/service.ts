import { MedusaService } from "@medusajs/framework/utils"
import VolumeDiscount, { CreateVolumeDiscountInput, UpdateVolumeDiscountInput } from "./models/volume-discount"
import VolumeDiscountProduct from "./models/volume-discount-product"

class VolumeDiscountService extends MedusaService({
  VolumeDiscount,
  VolumeDiscountProduct,
}) {
  /**
   * Create a new volume discount tier
   */
  async createVolumeDiscount(data: CreateVolumeDiscountInput): Promise<VolumeDiscount> {
    const { product_ids, ...discountData } = data
    
    // Create the volume discount
    const discount = await this.createVolumeDiscounts(discountData)
    
    // If product_ids are provided, create the relationships
    if (product_ids && product_ids.length > 0) {
      const productRelations = product_ids.map(product_id => ({
        id: `vdp_${discount.id}_${product_id}`,
        volume_discount_id: discount.id,
        product_id
      }))
      
      for (const relation of productRelations) {
        await this.createVolumeDiscountProducts(relation)
      }
    }
    
    return discount
  }

  /**
   * Update an existing volume discount tier
   */
  async updateVolumeDiscount(id: string, data: Partial<UpdateVolumeDiscountInput>): Promise<VolumeDiscount> {
    return await this.updateVolumeDiscounts(id, data)
  }

  /**
   * Delete a volume discount tier
   */
  async deleteVolumeDiscount(id: string): Promise<void> {
    await this.deleteVolumeDiscounts(id)
  }

  /**
   * Get volume discounts for a specific product
   * Including product-specific, category, and global discounts
   */
  async getVolumeDiscountsByProduct(productId: string, categoryIds?: string[]): Promise<VolumeDiscount[]> {
    const now = new Date()
    
    // Get product-specific discounts
    const productDiscounts = await this.listVolumeDiscountProducts(
      { product_id: productId },
      { relations: ["volume_discount"] }
    )
    
    const productDiscountIds = productDiscounts.map(pd => pd.volume_discount_id)
    
    // Build query for all applicable discounts
    const query: any = {
      $and: [
        { is_active: true },
        {
          $or: [
            { valid_from: null },
            { valid_from: { $lte: now } }
          ]
        },
        {
          $or: [
            { valid_until: null },
            { valid_until: { $gte: now } }
          ]
        },
        {
          $or: [
            // Product-specific discounts
            { id: { $in: productDiscountIds } },
            // Global discounts (excluding this product)
            {
              $and: [
                { discount_type: "global" },
                {
                  $or: [
                    { excluded_product_ids: null },
                    { excluded_product_ids: { $not: { $contains: productId } } }
                  ]
                }
              ]
            },
            // Category discounts if categories provided
            ...(categoryIds && categoryIds.length > 0 ? [{
              $and: [
                { discount_type: "categories" },
                { category_ids: { $overlap: categoryIds } },
                {
                  $or: [
                    { excluded_product_ids: null },
                    { excluded_product_ids: { $not: { $contains: productId } } }
                  ]
                }
              ]
            }] : [])
          ]
        }
      ]
    }
    
    return await this.listVolumeDiscounts(
      query,
      { 
        orderBy: { priority: "DESC", min_quantity: "ASC" } 
      }
    )
  }

  /**
   * Get the best volume discount for a specific quantity
   * Considers product-specific, category, and global discounts
   */
  async getBestDiscountForQuantity(
    productId: string, 
    quantity: number, 
    categoryIds?: string[]
  ): Promise<VolumeDiscount | null> {
    const applicableDiscounts = await this.getVolumeDiscountsByProduct(productId, categoryIds)
    
    // Filter by quantity range
    const validDiscounts = applicableDiscounts.filter(discount => 
      discount.min_quantity <= quantity &&
      (discount.max_quantity === null || discount.max_quantity >= quantity)
    )
    
    if (validDiscounts.length === 0) return null
    
    // Sort by discount value (considering both percentage and fixed amounts)
    // and then by priority
    validDiscounts.sort((a, b) => {
      // Compare discount values
      const aValue = a.discount_value_type === 'percentage' 
        ? a.discount_percentage 
        : 0 // We'd need price to calculate fixed discount percentage
      const bValue = b.discount_value_type === 'percentage' 
        ? b.discount_percentage 
        : 0
      
      if (aValue !== bValue) return bValue - aValue
      return b.priority - a.priority
    })
    
    return validDiscounts[0]
  }

  /**
   * Get all volume discount tiers for admin management
   */
  async listAllVolumeDiscounts(
    filters: { discount_type?: string; is_active?: boolean } = {},
    config: { skip?: number; take?: number; relations?: string[] } = {}
  ): Promise<VolumeDiscount[]> {
    return await this.listVolumeDiscounts(
      filters,
      {
        orderBy: { created_at: "DESC" },
        ...config
      }
    )
  }

  /**
   * Get a single volume discount by ID
   */
  async retrieveVolumeDiscount(id: string): Promise<VolumeDiscount> {
    return await this.retrieveVolumeDiscounts(id)
  }
}

export default VolumeDiscountService