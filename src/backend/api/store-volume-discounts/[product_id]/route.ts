import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import VolumeDiscountService from "../../../../modules/volume-discount/service"

// GET /store/volume-discounts/:product_id
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const volumeDiscountService: VolumeDiscountService = req.scope.resolve("volumeDiscountModuleService")
  const { product_id } = req.params
  const { quantity } = req.query as { quantity?: string }

  try {
    if (quantity) {
      // Get the best discount for a specific quantity
      const discount = await volumeDiscountService.getBestDiscountForQuantity(
        product_id,
        parseInt(quantity)
      )
      
      res.json({
        volume_discount: discount,
        applied_quantity: parseInt(quantity)
      })
    } else {
      // Get all volume discount tiers for the product
      const discounts = await volumeDiscountService.getVolumeDiscountsByProduct(product_id)
      
      res.json({
        volume_discounts: discounts,
        count: discounts.length
      })
    }
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve volume discounts",
      error: error.message
    })
  }
}