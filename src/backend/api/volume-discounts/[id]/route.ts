import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import VolumeDiscountService from "../../../../modules/volume-discount/service"

// GET /admin/volume-discounts/:id
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const volumeDiscountService: VolumeDiscountService = req.scope.resolve("volumeDiscountModuleService")
  const { id } = req.params

  try {
    const discount = await volumeDiscountService.retrieveVolumeDiscount(id)
    
    res.json({
      volume_discount: discount
    })
  } catch (error) {
    res.status(404).json({
      message: "Volume discount not found",
      error: error.message
    })
  }
}

// PUT /admin/volume-discounts/:id
export async function PUT(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const volumeDiscountService: VolumeDiscountService = req.scope.resolve("volumeDiscountModuleService")
  const { id } = req.params
  
  const updateData: any = {}
  const {
    discount_type,
    product_ids,
    category_ids,
    excluded_product_ids,
    min_quantity,
    max_quantity,
    discount_percentage,
    discount_value_type,
    discount_fixed_amount,
    title,
    description,
    is_active,
    priority,
    valid_from,
    valid_until,
    usage_limit,
    usage_limit_per_customer
  } = req.body

  if (discount_type !== undefined) updateData.discount_type = discount_type
  if (category_ids !== undefined) updateData.category_ids = category_ids
  if (excluded_product_ids !== undefined) updateData.excluded_product_ids = excluded_product_ids
  if (min_quantity !== undefined) updateData.min_quantity = parseInt(min_quantity)
  if (max_quantity !== undefined) updateData.max_quantity = max_quantity ? parseInt(max_quantity) : null
  if (discount_percentage !== undefined) updateData.discount_percentage = parseFloat(discount_percentage)
  if (discount_value_type !== undefined) updateData.discount_value_type = discount_value_type
  if (discount_fixed_amount !== undefined) updateData.discount_fixed_amount = parseFloat(discount_fixed_amount)
  if (title !== undefined) updateData.title = title
  if (description !== undefined) updateData.description = description
  if (is_active !== undefined) updateData.is_active = is_active
  if (priority !== undefined) updateData.priority = parseInt(priority)
  if (valid_from !== undefined) updateData.valid_from = valid_from ? new Date(valid_from) : null
  if (valid_until !== undefined) updateData.valid_until = valid_until ? new Date(valid_until) : null
  if (usage_limit !== undefined) updateData.usage_limit = usage_limit ? parseInt(usage_limit) : null
  if (usage_limit_per_customer !== undefined) updateData.usage_limit_per_customer = usage_limit_per_customer ? parseInt(usage_limit_per_customer) : null

  try {
    const discount = await volumeDiscountService.updateVolumeDiscount(id, updateData)
    
    // Handle product_ids update if provided
    if (product_ids !== undefined) {
      // Remove existing product relationships
      const existingProducts = await volumeDiscountService.listVolumeDiscountProducts(
        { volume_discount_id: id }
      )
      for (const ep of existingProducts) {
        await volumeDiscountService.deleteVolumeDiscountProducts(ep.id)
      }
      
      // Add new product relationships
      if (product_ids.length > 0) {
        const productRelations = product_ids.map(product_id => ({
          volume_discount_id: id,
          product_id
        }))
        await volumeDiscountService.createVolumeDiscountProducts(productRelations)
      }
    }
    
    res.json({
      volume_discount: discount
    })
  } catch (error) {
    res.status(404).json({
      message: "Volume discount not found",
      error: error.message
    })
  }
}

// DELETE /admin/volume-discounts/:id
export async function DELETE(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const volumeDiscountService: VolumeDiscountService = req.scope.resolve("volumeDiscountModuleService")
  const { id } = req.params

  try {
    await volumeDiscountService.deleteVolumeDiscount(id)
    
    res.status(200).json({
      message: "Volume discount deleted successfully"
    })
  } catch (error) {
    res.status(404).json({
      message: "Volume discount not found",
      error: error.message
    })
  }
}