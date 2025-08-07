# API Reference

Complete API reference for the Medusa Volume Discounts Extension.

## Admin API Endpoints

All admin endpoints require authentication and proper permissions.

### List Volume Discounts

**`GET /admin/volume-discounts`**

Retrieve a paginated list of volume discounts with optional filtering.

#### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | integer | 20 | Number of discounts to return (max 100) |
| `offset` | integer | 0 | Number of discounts to skip |
| `discount_type` | string | - | Filter by type: `global`, `products`, `categories` |
| `is_active` | boolean | - | Filter by active status |
| `product_id` | string | - | Filter discounts that apply to specific product |

#### Response

```json
{
  "volume_discounts": [
    {
      "id": "vd_01HZDVWQZM8KPNP3C2KGFB1MNR",
      "title": "Bulk Purchase Discount",
      "description": "Discount for bulk orders",
      "discount_type": "global",
      "min_quantity": 10,
      "max_quantity": null,
      "discount_percentage": 15,
      "discount_value_type": "percentage", 
      "discount_fixed_amount": null,
      "priority": 5,
      "is_active": true,
      "valid_from": "2024-01-01T00:00:00Z",
      "valid_until": "2024-12-31T23:59:59Z", 
      "usage_limit": 1000,
      "usage_count": 45,
      "usage_limit_per_customer": 3,
      "category_ids": null,
      "excluded_product_ids": ["prod_premium_item"],
      "products": [],
      "created_at": "2024-01-01T10:00:00Z",
      "updated_at": "2024-01-15T14:30:00Z"
    }
  ],
  "count": 1,
  "offset": 0,
  "limit": 20
}
```

### Create Volume Discount

**`POST /admin/volume-discounts`**

Create a new volume discount.

#### Request Body

```json
{
  "title": "New Volume Discount",
  "description": "Optional description",
  "discount_type": "products",
  "product_ids": ["prod_123", "prod_456"],
  "min_quantity": 5,
  "max_quantity": 20,
  "discount_value_type": "percentage",
  "discount_percentage": 10,
  "priority": 0,
  "is_active": true,
  "valid_from": "2024-06-01T00:00:00Z",
  "valid_until": "2024-06-30T23:59:59Z",
  "usage_limit": 100,
  "usage_limit_per_customer": 2
}
```

#### Field Validation

| Field | Required | Type | Validation |
|-------|----------|------|------------|
| `title` | Yes | string | 1-255 characters |
| `discount_type` | Yes | enum | `global`, `products`, `categories` |
| `min_quantity` | Yes | integer | ≥ 1 |
| `max_quantity` | No | integer | ≥ min_quantity |
| `discount_value_type` | Yes | enum | `percentage`, `fixed` |
| `discount_percentage` | Conditional | number | 0-100, required if type=percentage |
| `discount_fixed_amount` | Conditional | number | ≥ 0, required if type=fixed |
| `product_ids` | Conditional | string[] | Required if discount_type=products |
| `category_ids` | Conditional | string[] | Required if discount_type=categories |
| `priority` | No | integer | ≥ 0 |
| `is_active` | No | boolean | Default: true |

#### Response

```json
{
  "volume_discount": {
    "id": "vd_01HZDVWQZM8KPNP3C2KGFB1MNR",
    "title": "New Volume Discount",
    // ... full discount object
  }
}
```

### Get Volume Discount

**`GET /admin/volume-discounts/:id`**

Retrieve a specific volume discount by ID.

#### Response

```json
{
  "volume_discount": {
    "id": "vd_01HZDVWQZM8KPNP3C2KGFB1MNR",
    "title": "Bulk Purchase Discount",
    // ... full discount object with related products
    "products": [
      {
        "id": "vdp_01HZDVWQZM8KPNP3C2KGFB1ABC",
        "volume_discount_id": "vd_01HZDVWQZM8KPNP3C2KGFB1MNR",
        "product_id": "prod_123"
      }
    ]
  }
}
```

### Update Volume Discount

**`PUT /admin/volume-discounts/:id`**

Update an existing volume discount. All fields are optional in updates.

#### Request Body

```json
{
  "title": "Updated Discount Title",
  "is_active": false,
  "max_quantity": 50,
  "product_ids": ["prod_123", "prod_789"]
}
```

#### Response

```json
{
  "volume_discount": {
    "id": "vd_01HZDVWQZM8KPNP3C2KGFB1MNR",
    // ... updated discount object
  }
}
```

### Delete Volume Discount

**`DELETE /admin/volume-discounts/:id`**

Delete a volume discount and all related product associations.

#### Response

```json
{
  "message": "Volume discount deleted successfully"
}
```

## Store API Endpoints

Store endpoints are publicly accessible and don't require authentication.

### Get Product Volume Discounts

**`GET /store/volume-discounts/:product_id`**

Get all active volume discounts applicable to a specific product.

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `product_id` | string | The product ID to get discounts for |

#### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `category_ids` | string | Comma-separated category IDs for category-based discounts |

#### Response

```json
{
  "discounts": [
    {
      "id": "vd_01HZDVWQZM8KPNP3C2KGFB1MNR",
      "title": "Bulk Purchase Discount",
      "min_quantity": 10,
      "max_quantity": null,
      "discount_percentage": 15,
      "discount_value_type": "percentage",
      "discount_fixed_amount": null,
      "priority": 5
    },
    {
      "id": "vd_01HZDVWQZM8KPNP3C2KGFB1XYZ", 
      "title": "Category Discount",
      "min_quantity": 5,
      "max_quantity": 9,
      "discount_percentage": 10,
      "discount_value_type": "percentage",
      "discount_fixed_amount": null,
      "priority": 1
    }
  ]
}
```

## Error Responses

All endpoints return consistent error responses:

### 400 Bad Request

```json
{
  "message": "Validation failed",
  "errors": [
    {
      "field": "min_quantity",
      "message": "Minimum quantity must be greater than 0"
    }
  ]
}
```

### 401 Unauthorized

```json
{
  "message": "Unauthorized"
}
```

### 404 Not Found

```json
{
  "message": "Volume discount not found",
  "error": "Resource with ID vd_invalid does not exist"
}
```

### 500 Internal Server Error

```json
{
  "message": "Internal server error",
  "error": "Database connection failed"
}
```

## Integration Examples

### JavaScript/TypeScript Client

```typescript
class VolumeDiscountClient {
  private baseUrl: string
  private token?: string

  constructor(baseUrl: string, token?: string) {
    this.baseUrl = baseUrl
    this.token = token
  }

  async getDiscounts(params?: {
    limit?: number
    offset?: number
    discount_type?: string
    is_active?: boolean
  }) {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString())
        }
      })
    }

    const response = await fetch(
      `${this.baseUrl}/admin/volume-discounts?${searchParams}`,
      {
        headers: this.getHeaders()
      }
    )
    
    return response.json()
  }

  async createDiscount(discount: CreateVolumeDiscountInput) {
    const response = await fetch(`${this.baseUrl}/admin/volume-discounts`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(discount)
    })
    
    return response.json()
  }

  async getProductDiscounts(productId: string) {
    const response = await fetch(
      `${this.baseUrl}/store/volume-discounts/${productId}`
    )
    
    return response.json()
  }

  private getHeaders() {
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    }
    
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }
    
    return headers
  }
}

// Usage
const client = new VolumeDiscountClient('http://localhost:9000', 'your-admin-token')

// Get all discounts
const discounts = await client.getDiscounts({ is_active: true })

// Create a discount
const newDiscount = await client.createDiscount({
  title: 'Summer Sale',
  discount_type: 'global',
  min_quantity: 5,
  discount_percentage: 15,
  discount_value_type: 'percentage'
})
```

### React Hook

```typescript
import { useState, useEffect } from 'react'

interface VolumeDiscount {
  id: string
  title: string
  min_quantity: number
  max_quantity: number | null
  discount_percentage?: number
  discount_fixed_amount?: number
  discount_value_type: 'percentage' | 'fixed'
}

export const useVolumeDiscounts = (productId: string) => {
  const [discounts, setDiscounts] = useState<VolumeDiscount[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false

    const fetchDiscounts = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(`/store/volume-discounts/${productId}`)
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }
        
        const data = await response.json()
        
        if (!cancelled) {
          setDiscounts(data.discounts || [])
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error('Unknown error'))
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    if (productId) {
      fetchDiscounts()
    }

    return () => {
      cancelled = true
    }
  }, [productId])

  return { discounts, loading, error }
}
```

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **Admin endpoints**: 100 requests per minute per authenticated user
- **Store endpoints**: 1000 requests per minute per IP address

Rate limit headers are included in all responses:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

When rate limits are exceeded, a 429 status is returned:

```json
{
  "message": "Rate limit exceeded",
  "retry_after": 60
}
```

## Webhooks

The extension triggers webhooks for discount events:

### Volume Discount Created

```json
{
  "event": "volume_discount.created",
  "data": {
    "id": "vd_01HZDVWQZM8KPNP3C2KGFB1MNR",
    // ... full discount object
  }
}
```

### Volume Discount Updated

```json
{
  "event": "volume_discount.updated", 
  "data": {
    "id": "vd_01HZDVWQZM8KPNP3C2KGFB1MNR",
    // ... updated discount object
  }
}
```

### Volume Discount Applied

```json
{
  "event": "volume_discount.applied",
  "data": {
    "discount_id": "vd_01HZDVWQZM8KPNP3C2KGFB1MNR",
    "order_id": "order_01HZDVWQZM8KPNP3C2KGFB1ABC",
    "customer_id": "cus_01HZDVWQZM8KPNP3C2KGFB1DEF",
    "quantity": 15,
    "discount_amount": 75.50
  }
}
```

Configure webhooks in your `medusa-config.js`:

```javascript
export default defineConfig({
  projectConfig: {
    // ... other config
    webhooks: {
      "volume_discount.created": "https://your-app.com/webhooks/volume-discount-created",
      "volume_discount.applied": "https://your-app.com/webhooks/volume-discount-applied"
    }
  }
})
```