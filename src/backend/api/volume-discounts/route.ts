import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import VolumeDiscountService from "../../../modules/volume-discount/service"

// GET /admin/volume-discounts
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const volumeDiscountService: VolumeDiscountService = req.scope.resolve("volumeDiscountModuleService")
  
  const { product_id, discount_type, is_active, offset = 0, limit = 20 } = req.query as {
    product_id?: string
    discount_type?: string
    is_active?: string
    offset?: string
    limit?: string
  }

  const filters: any = {}
  if (discount_type) filters.discount_type = discount_type
  if (is_active !== undefined) filters.is_active = is_active === "true"

  try {
    let discounts = await volumeDiscountService.listAllVolumeDiscounts(
      filters,
      {
        skip: parseInt(offset),
        take: parseInt(limit)
      }
    )

    // If filtering by product_id, filter discounts that have this product
    if (product_id) {
      const productDiscounts = await volumeDiscountService.listVolumeDiscountProducts(
        { product_id }
      )
      const discountIds = productDiscounts.map(pd => pd.volume_discount_id)
      discounts = discounts.filter(d => discountIds.includes(d.id))
    }

    // For each discount, get associated products
    for (const discount of discounts) {
      if (discount.discount_type === "products") {
        try {
          const productRelations = await volumeDiscountService.listVolumeDiscountProducts(
            { volume_discount_id: discount.id }
          )
          discount.products = productRelations
        } catch (error) {
          console.error("Error fetching products for discount:", discount.id, error)
          discount.products = []
        }
      }
    }

    res.json({
      volume_discounts: discounts,
      count: discounts.length,
      offset: parseInt(offset),
      limit: parseInt(limit)
    })
  } catch (error) {
    console.error("Error fetching volume discounts:", error)
    res.status(500).json({
      message: "Error fetching volume discounts",
      error: error.message
    })
  }
}

// POST /admin/volume-discounts
export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const volumeDiscountService: VolumeDiscountService = req.scope.resolve("volumeDiscountModuleService")
  
  const {
    discount_type = "products",
    product_ids,
    category_ids,
    excluded_product_ids,
    min_quantity,
    max_quantity,
    discount_percentage,
    discount_value_type = "percentage",
    discount_fixed_amount,
    title,
    description,
    is_active = true,
    priority = 0,
    valid_from,
    valid_until,
    usage_limit,
    usage_limit_per_customer
  } = req.body

  if (!min_quantity || !title) {
    res.status(400).json({
      message: "Missing required fields: min_quantity, title"
    })
    return
  }

  if (discount_value_type === "percentage" && !discount_percentage) {
    res.status(400).json({
      message: "discount_percentage is required when discount_value_type is percentage"
    })
    return
  }

  if (discount_value_type === "fixed" && !discount_fixed_amount) {
    res.status(400).json({
      message: "discount_fixed_amount is required when discount_value_type is fixed"
    })
    return
  }

  try {
    console.log("Creating volume discount with data:", {
      discount_type,
      product_ids,
      min_quantity: parseInt(min_quantity),
      title,
      is_active
    })
    
    const discount = await volumeDiscountService.createVolumeDiscount({
      discount_type,
      product_ids,
      category_ids,
      excluded_product_ids,
      min_quantity: parseInt(min_quantity),
      max_quantity: max_quantity ? parseInt(max_quantity) : null,
      discount_percentage: discount_percentage ? parseFloat(discount_percentage) : undefined,
      discount_value_type,
      discount_fixed_amount: discount_fixed_amount ? parseFloat(discount_fixed_amount) : undefined,
      title,
      description,
      is_active,
      priority: parseInt(priority),
      valid_from: valid_from ? new Date(valid_from) : null,
      valid_until: valid_until ? new Date(valid_until) : null,
      usage_limit: usage_limit ? parseInt(usage_limit) : null,
      usage_limit_per_customer: usage_limit_per_customer ? parseInt(usage_limit_per_customer) : null
    })
    
    console.log("Created discount:", discount)

    res.status(201).json({
      volume_discount: discount
    })
  } catch (error) {
    res.status(500).json({
      message: "Failed to create volume discount",
      error: error.message
    })
  }
}