# Basic Usage Examples

This guide provides practical examples of how to use the Medusa Volume Discounts Extension in common e-commerce scenarios.

## Example 1: Simple Product Volume Discount

**Scenario**: Encourage customers to buy more of a specific product by offering quantity discounts.

### Configuration

Create a discount that applies to a specific product:

```json
{
  "title": "T-Shirt Bulk Discount",
  "description": "Buy more t-shirts, save more",
  "discount_type": "products",
  "product_ids": ["prod_tshirt_classic_01"],
  "min_quantity": 3,
  "max_quantity": null,
  "discount_value_type": "percentage",
  "discount_percentage": 15,
  "is_active": true,
  "priority": 0
}
```

### Result
- Customer buys 1-2 t-shirts: Regular price
- Customer buys 3+ t-shirts: 15% discount on all t-shirts

### Admin Interface Steps

1. Go to Volume Discounts admin page
2. Click "Create Discount"
3. Fill in:
   - Title: "T-Shirt Bulk Discount"
   - Type: "Specific Products"
   - Select your t-shirt product
   - Minimum Quantity: 3
   - Discount Type: "Percentage"
   - Discount Percentage: 15
4. Click "Create Discount"

## Example 2: Tiered Pricing Strategy

**Scenario**: Create multiple discount tiers with increasing benefits for larger quantities.

### Configuration

Create three separate discounts with different priorities:

**Tier 1: Small Bulk (Priority 1)**
```json
{
  "title": "Small Bulk - 5% Off",
  "discount_type": "global", 
  "min_quantity": 5,
  "max_quantity": 9,
  "discount_percentage": 5,
  "priority": 1
}
```

**Tier 2: Medium Bulk (Priority 2)**
```json
{
  "title": "Medium Bulk - 10% Off",
  "discount_type": "global",
  "min_quantity": 10, 
  "max_quantity": 19,
  "discount_percentage": 10,
  "priority": 2
}
```

**Tier 3: Large Bulk (Priority 3)**
```json
{
  "title": "Large Bulk - 20% Off",
  "discount_type": "global",
  "min_quantity": 20,
  "max_quantity": null,
  "discount_percentage": 20,
  "priority": 3
}
```

### Result
- 1-4 items: No discount
- 5-9 items: 5% discount
- 10-19 items: 10% discount  
- 20+ items: 20% discount

## Example 3: Category-Based Seasonal Sale

**Scenario**: Run a limited-time promotion on all electronics with volume incentives.

### Configuration

```json
{
  "title": "Electronics Holiday Sale",
  "description": "Holiday discount on all electronics",
  "discount_type": "categories",
  "category_ids": ["cat_electronics", "cat_gadgets"],
  "excluded_product_ids": ["prod_iphone_pro", "prod_macbook_pro"],
  "min_quantity": 2,
  "discount_percentage": 15,
  "valid_from": "2024-11-25T00:00:00Z",
  "valid_until": "2024-12-25T23:59:59Z",
  "usage_limit": 500,
  "is_active": true
}
```

### Features
- Applies to all products in electronics and gadgets categories
- Excludes premium items (iPhone Pro, MacBook Pro)
- Requires minimum 2 items
- Valid only during holiday season
- Limited to first 500 uses

## Example 4: B2B Wholesale Pricing

**Scenario**: Offer wholesale pricing for business customers with different tiers based on order volume.

### Configuration

**Wholesale Tier 1**
```json
{
  "title": "Wholesale - Basic (25+ items)",
  "discount_type": "global",
  "min_quantity": 25,
  "max_quantity": 49,
  "discount_percentage": 20,
  "usage_limit_per_customer": 12,
  "priority": 5
}
```

**Wholesale Tier 2**
```json
{
  "title": "Wholesale - Premium (50+ items)", 
  "discount_type": "global",
  "min_quantity": 50,
  "max_quantity": 99,
  "discount_percentage": 30,
  "usage_limit_per_customer": 12,
  "priority": 6
}
```

**Wholesale Tier 3**
```json
{
  "title": "Wholesale - Elite (100+ items)",
  "discount_type": "global", 
  "min_quantity": 100,
  "discount_percentage": 40,
  "usage_limit_per_customer": 12,
  "priority": 7
}
```

### Features
- Three wholesale tiers with increasing discounts
- Per-customer usage limits (monthly orders)
- Higher priority than retail discounts

## Example 5: Fixed Amount Discount

**Scenario**: Offer a fixed dollar amount off for bulk purchases instead of percentage.

### Configuration

```json
{
  "title": "Bulk Purchase - $50 Off",
  "discount_type": "global",
  "min_quantity": 10,
  "discount_value_type": "fixed", 
  "discount_fixed_amount": 50,
  "is_active": true,
  "usage_limit": 100
}
```

### Result
- Customers get exactly $50 off their order when buying 10+ items
- More predictable savings for customers
- Better for high-value items

## Example 6: Product Bundle Incentive

**Scenario**: Encourage customers to buy multiple related products together.

### Configuration

```json
{
  "title": "Complete Office Setup Bundle",
  "discount_type": "products",
  "product_ids": [
    "prod_desk_01",
    "prod_chair_01", 
    "prod_lamp_01",
    "prod_organizer_01"
  ],
  "min_quantity": 3,
  "discount_percentage": 25,
  "description": "Buy 3+ office items, save 25%"
}
```

### Marketing Message
"Complete your office setup! Buy any 3 office items and save 25%"

## Example 7: Limited-Time Flash Sale

**Scenario**: Create urgency with a high-discount, short-duration sale with usage limits.

### Configuration

```json
{
  "title": "48-Hour Flash Sale - 30% Off",
  "discount_type": "global", 
  "min_quantity": 2,
  "discount_percentage": 30,
  "valid_from": "2024-07-01T00:00:00Z",
  "valid_until": "2024-07-03T00:00:00Z",
  "usage_limit": 50,
  "usage_limit_per_customer": 1,
  "priority": 10
}
```

### Features
- High discount percentage to create urgency
- Short duration (48 hours)
- Limited total uses (scarcity)
- One use per customer (fairness)
- High priority to override other discounts

## Storefront Integration Examples

### React Component for Displaying Discounts

```tsx
import React from 'react'
import { useVolumeDiscounts } from '../hooks/useVolumeDiscounts'

interface VolumeDiscountBadgeProps {
  productId: string
  currentQuantity?: number
}

export const VolumeDiscountBadge: React.FC<VolumeDiscountBadgeProps> = ({
  productId,
  currentQuantity = 1
}) => {
  const { discounts, loading } = useVolumeDiscounts(productId)
  
  if (loading || !discounts.length) return null

  const applicableDiscount = discounts.find(
    d => currentQuantity >= d.min_quantity && 
         (!d.max_quantity || currentQuantity <= d.max_quantity)
  )

  const nextTierDiscount = discounts.find(
    d => d.min_quantity > currentQuantity
  )

  return (
    <div className="volume-discount-info">
      {applicableDiscount && (
        <div className="current-discount bg-green-100 text-green-800 p-2 rounded">
          🎉 You're saving {applicableDiscount.discount_percentage}% with this quantity!
        </div>
      )}
      
      {nextTierDiscount && !applicableDiscount && (
        <div className="next-tier bg-blue-100 text-blue-800 p-2 rounded">
          💡 Add {nextTierDiscount.min_quantity - currentQuantity} more items 
          to save {nextTierDiscount.discount_percentage}%
        </div>
      )}
      
      <div className="all-tiers mt-2">
        <h4>Volume Discounts Available:</h4>
        <ul className="list-disc pl-5">
          {discounts.map(discount => (
            <li key={discount.id}>
              Buy {discount.min_quantity}+ items: 
              <strong> {discount.discount_percentage}% off</strong>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
```

### Cart Integration

```tsx
export const CartSummary: React.FC<{ items: CartItem[] }> = ({ items }) => {
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0)
  const { discounts } = useVolumeDiscounts(items[0]?.product_id)
  
  const applicableDiscount = discounts?.find(
    d => totalQuantity >= d.min_quantity && 
         (!d.max_quantity || totalQuantity <= d.max_quantity)
  )

  return (
    <div className="cart-summary">
      <div className="total-quantity">
        Total Items: {totalQuantity}
      </div>
      
      {applicableDiscount && (
        <div className="discount-applied">
          <span className="text-green-600">
            Volume Discount Applied: -{applicableDiscount.discount_percentage}%
          </span>
        </div>
      )}
      
      {/* Cart totals */}
    </div>
  )
}
```

## Testing Your Discounts

### Manual Testing Checklist

For each discount you create:

- [ ] **Quantity Validation**: Test with quantities below, at, and above thresholds
- [ ] **Date Restrictions**: Test before, during, and after validity period
- [ ] **Usage Limits**: Test reaching and exceeding usage limits
- [ ] **Priority Conflicts**: Test when multiple discounts could apply
- [ ] **Product Exclusions**: Test excluded products don't receive discount
- [ ] **Category Scope**: Test category-based discounts apply correctly

### Automated Testing with API

```javascript
// Test discount application
const testVolumeDiscount = async () => {
  // Create test discount
  const discount = await fetch('/admin/volume-discounts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: 'Test Discount',
      discount_type: 'global',
      min_quantity: 5,
      discount_percentage: 10
    })
  })

  // Test with qualifying quantity
  const response = await fetch('/store/volume-discounts/prod_test')
  const { discounts } = await response.json()
  
  console.log('Available discounts:', discounts)
  
  // Cleanup
  await fetch(`/admin/volume-discounts/${discount.id}`, { 
    method: 'DELETE' 
  })
}
```

## Best Practices

### 1. Clear Communication
- Use descriptive titles that explain the offer
- Add helpful descriptions for internal reference
- Show discount tiers prominently on product pages

### 2. Strategic Pricing
- Research competitor volume pricing
- Consider your profit margins carefully
- Test different discount percentages

### 3. Customer Psychology
- Create clear breakpoints (5, 10, 20 vs 7, 13, 18)
- Use progressive discounts to encourage larger orders
- Add urgency with time limits when appropriate

### 4. Monitoring and Optimization
- Track usage with built-in analytics
- Monitor profit impact of different discount levels
- A/B test different discount structures

These examples should give you a solid foundation for implementing volume discounts that drive sales and improve customer satisfaction!