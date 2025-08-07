# Installation Guide

This guide will walk you through installing the Medusa Volume Discounts Extension in your existing Medusa v2 project.

## Prerequisites

- Medusa v2.0.0 or higher
- Node.js 20+ 
- PostgreSQL database
- Existing Medusa project setup

## Backend Installation

### Step 1: Copy Module Files

Copy the volume discount module to your Medusa project:

```bash
# From the extension directory
cp -r src/backend/modules/volume-discount YOUR_MEDUSA_PROJECT/src/modules/

# Alternative: Manual copy
# Copy each file maintaining the directory structure:
# - models/volume-discount.ts
# - models/volume-discount-product.ts  
# - service.ts
# - index.ts
# - migrations/
```

### Step 2: Copy API Routes

Copy the API endpoints for both admin and store:

```bash
# Copy admin routes
cp -r src/backend/api/volume-discounts YOUR_MEDUSA_PROJECT/src/api/admin/

# Copy store routes  
cp -r src/backend/api/store-volume-discounts YOUR_MEDUSA_PROJECT/src/api/store/volume-discounts
```

Your project structure should now look like:
```
your-medusa-project/
├── src/
│   ├── api/
│   │   ├── admin/
│   │   │   └── volume-discounts/
│   │   │       ├── route.ts
│   │   │       └── [id]/
│   │   │           └── route.ts
│   │   └── store/
│   │       └── volume-discounts/
│   │           └── [product_id]/
│   │               └── route.ts
│   └── modules/
│       └── volume-discount/
│           ├── index.ts
│           ├── service.ts
│           ├── models/
│           │   ├── volume-discount.ts
│           │   └── volume-discount-product.ts
│           └── migrations/
│               ├── Migration20250807000000.ts
│               └── Migration20250807100000.ts
```

### Step 3: Run Database Migrations

The extension includes database migrations that will create the necessary tables:

```bash
cd YOUR_MEDUSA_PROJECT
npx medusa db:migrate
```

You should see output similar to:
```
MODULE: volumeDiscountModuleService
  ● Migrating Migration20250807000000  
  ✔ Migrated Migration20250807000000
  ● Migrating Migration20250807100000
  ✔ Migrated Migration20250807100000
Completed successfully
```

### Step 4: Verify Backend Installation

Start your Medusa development server:

```bash
npm run dev
```

Check that the module is loaded correctly by looking for:
```
[INFO]: Loading modules...
[INFO]: Module volumeDiscountModuleService loaded successfully
```

Test the API endpoints:
```bash
# Test admin endpoint (will return 401 Unauthorized, which is expected)
curl http://localhost:9000/admin/volume-discounts

# Test store endpoint  
curl http://localhost:9000/store/volume-discounts/prod_test123
```

## Frontend Installation

### Step 1: Copy Admin Page

Copy the admin page component to your project:

```bash
# Create the directory structure
mkdir -p YOUR_MEDUSA_PROJECT/src/admin/routes/volume-discounts

# Copy the page component
cp src/frontend/admin/volume-discounts-page.tsx YOUR_MEDUSA_PROJECT/src/admin/routes/volume-discounts/page.tsx
```

### Step 2: Install Dependencies

The admin page uses Lucide React icons. Install if not already present:

```bash
cd YOUR_MEDUSA_PROJECT
npm install lucide-react
```

### Step 3: Verify Frontend Installation

Restart your development server:

```bash
npm run dev
```

Navigate to the admin panel:
1. Go to `http://localhost:9000/app`
2. Log in with your admin credentials
3. Look for "Volume Discounts" in the sidebar menu
4. Click to access the Volume Discounts management page

![Volume Discounts Admin Interface](screenshots/SCR-20250807-kmjf.png)
*The Volume Discounts admin interface after successful installation*

## Storefront Integration (Optional)

### Basic Integration

To display volume discounts on your storefront, you can fetch discount information using the store API:

```typescript
// hooks/useVolumeDiscounts.ts
import { useState, useEffect } from 'react'

export const useVolumeDiscounts = (productId: string) => {
  const [discounts, setDiscounts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const response = await fetch(`/store/volume-discounts/${productId}`)
        const data = await response.json()
        setDiscounts(data.discounts || [])
      } catch (error) {
        console.error('Failed to fetch volume discounts:', error)
      } finally {
        setLoading(false)
      }
    }

    if (productId) {
      fetchDiscounts()
    }
  }, [productId])

  return { discounts, loading }
}
```

### Display Component

Create a component to show available discounts:

```tsx
// components/VolumeDiscountDisplay.tsx
import { useVolumeDiscounts } from '../hooks/useVolumeDiscounts'

interface Props {
  productId: string
}

export const VolumeDiscountDisplay = ({ productId }: Props) => {
  const { discounts, loading } = useVolumeDiscounts(productId)
  
  if (loading) return <div>Loading discounts...</div>
  if (!discounts.length) return null

  return (
    <div className="volume-discounts bg-blue-50 p-4 rounded-lg">
      <h3 className="font-semibold text-blue-900 mb-2">Volume Discounts Available</h3>
      <div className="space-y-2">
        {discounts.map((discount: any) => (
          <div key={discount.id} className="flex justify-between text-sm">
            <span>Buy {discount.min_quantity}+ items</span>
            <span className="font-medium text-green-600">
              Save {discount.discount_value_type === 'percentage' 
                ? `${discount.discount_percentage}%` 
                : `$${discount.discount_fixed_amount}`}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
```

### Integration with Product Pages

Add the component to your product pages:

```tsx
// In your product page component
import { VolumeDiscountDisplay } from '../components/VolumeDiscountDisplay'

export const ProductPage = ({ product }) => {
  return (
    <div>
      {/* Your existing product content */}
      
      <VolumeDiscountDisplay productId={product.id} />
      
      {/* Rest of product page */}
    </div>
  )
}
```

## Configuration

### Environment Variables

No additional environment variables are required. The extension works with your existing Medusa configuration.

### Module Options

You can configure the module in your `medusa-config.js`:

```javascript
// medusa-config.js
import { defineConfig } from "@medusajs/medusa"

export default defineConfig({
  modules: [
    // Your existing modules...
    {
      resolve: "./src/modules/volume-discount",
      options: {
        // Optional configuration
        enableUsageTracking: true,
        maxDiscountPercentage: 99,
        defaultPriority: 0
      }
    }
  ]
})
```

## Verification Checklist

After installation, verify everything is working:

### Backend Verification
- [ ] Database migrations completed successfully
- [ ] Module appears in startup logs  
- [ ] API endpoints respond (even if unauthorized)
- [ ] No errors in development server logs

### Frontend Verification  
- [ ] "Volume Discounts" appears in admin sidebar
- [ ] Admin page loads without errors
- [ ] Can navigate to volume discounts management
- [ ] Create discount modal opens properly

### Database Verification
Connect to your PostgreSQL database and verify the tables exist:

```sql
-- Check if tables were created
\dt volume_discount*

-- Should show:
-- volume_discount
-- volume_discount_product
```

## Troubleshooting

### Common Issues

**Module not loading**
```
Error: Module volumeDiscountModuleService could not be loaded
```
- Check file paths are correct
- Ensure all files were copied properly  
- Verify `src/modules/volume-discount/index.ts` exists

**Migration errors**
```
Error in migration Migration20250807000000
```
- Ensure you have proper database permissions
- Check PostgreSQL is running and accessible
- Try running migrations individually

**Admin page not appearing**
- Clear browser cache and restart dev server
- Check for JavaScript errors in browser console
- Verify admin page file is in correct location

**API endpoints not working**
- Check API route files are in correct directories
- Restart development server after copying files
- Verify no conflicts with existing routes

### Getting Help

If you encounter issues:

1. Check the [Troubleshooting Guide](troubleshooting.md)
2. Review the [FAQ](faq.md)  
3. Search existing [GitHub Issues](https://github.com/alvaropuche-stack/medusa-volume-discounts-extension/issues)
4. Create a new issue with detailed error information

## Next Steps

After successful installation:

1. **Create your first discount**: Use the admin interface to create a test discount
2. **Configure storefront**: Add volume discount display to your product pages
3. **Test thoroughly**: Verify discounts apply correctly in different scenarios
4. **Customize**: Adapt the styling and behavior to match your brand

Congratulations! Your Medusa Volume Discounts Extension is now installed and ready to use.