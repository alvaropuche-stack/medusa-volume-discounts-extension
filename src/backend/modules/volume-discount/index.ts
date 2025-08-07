import { Module } from "@medusajs/framework/utils"
import VolumeDiscountService from "./service"

export const VOLUME_DISCOUNT_MODULE = "volumeDiscountModuleService"

export default Module(VOLUME_DISCOUNT_MODULE, {
  service: VolumeDiscountService,
})

export * from "./models/volume-discount"
export * from "./models/volume-discount-product"
export * from "./service"