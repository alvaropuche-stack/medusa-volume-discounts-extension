import { defineRouteConfig } from "@medusajs/admin-sdk"
import { 
  Container, Heading, Table, Badge, Button, DropdownMenu, IconButton, 
  Text, Alert, Input, Label, Switch, Textarea, Select, Tabs,
  RadioGroup, DatePicker, CommandBar, Checkbox
} from "@medusajs/ui"
import { useEffect, useState } from "react"
import { 
  Percent, MoreVertical, Plus, Pencil, Trash, X, Package, 
  Tag, Calendar, Users, ShoppingCart, AlertCircle, Check
} from "lucide-react"

interface VolumeDiscount {
  id: string
  discount_type: "global" | "products" | "categories"
  min_quantity: number
  max_quantity: number | null
  discount_percentage?: number
  discount_value_type: "percentage" | "fixed"
  discount_fixed_amount?: number
  title: string
  description?: string
  is_active: boolean
  priority: number
  valid_from?: string | null
  valid_until?: string | null
  usage_limit?: number | null
  usage_count: number
  usage_limit_per_customer?: number | null
  created_at: string
  updated_at: string
  products?: any[]
  category_ids?: string[]
  excluded_product_ids?: string[]
}

interface Product {
  id: string
  title: string
  thumbnail?: string
  variants?: any[]
}

const VolumeDiscountsPage = () => {
  const [discounts, setDiscounts] = useState<VolumeDiscount[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingDiscount, setEditingDiscount] = useState<VolumeDiscount | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [formData, setFormData] = useState({
    discount_type: "products" as "global" | "products" | "categories",
    min_quantity: "",
    max_quantity: "",
    discount_value_type: "percentage" as "percentage" | "fixed",
    discount_percentage: "",
    discount_fixed_amount: "",
    title: "",
    description: "",
    is_active: true,
    priority: "0",
    valid_from: null as Date | null,
    valid_until: null as Date | null,
    usage_limit: "",
    usage_limit_per_customer: "",
    category_ids: [] as string[],
    excluded_product_ids: [] as string[]
  })

  useEffect(() => {
    fetchDiscounts()
    fetchProducts()
  }, [])

  const fetchDiscounts = async () => {
    try {
      setLoading(true)
      console.log("Fetching volume discounts...")
      const response = await fetch("/admin/volume-discounts?limit=100")
      console.log("Response status:", response.status)
      const data = await response.json()
      console.log("Response data:", data)
      setDiscounts(data.volume_discounts || [])
    } catch (error) {
      console.error("Error fetching discounts:", error)
      showMessage('error', 'Failed to load discounts')
    } finally {
      setLoading(false)
    }
  }

  const fetchProducts = async () => {
    try {
      const response = await fetch("/admin/products?limit=1000&fields=id,title,thumbnail,variants")
      const data = await response.json()
      setProducts(data.products || [])
    } catch (error) {
      console.error("Error fetching products:", error)
    }
  }

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 3000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const payload: any = {
      discount_type: formData.discount_type,
      min_quantity: parseInt(formData.min_quantity),
      max_quantity: formData.max_quantity ? parseInt(formData.max_quantity) : null,
      discount_value_type: formData.discount_value_type,
      title: formData.title,
      description: formData.description,
      is_active: formData.is_active,
      priority: parseInt(formData.priority)
    }

    // Add discount value based on type
    if (formData.discount_value_type === "percentage") {
      payload.discount_percentage = parseFloat(formData.discount_percentage)
    } else {
      payload.discount_fixed_amount = parseFloat(formData.discount_fixed_amount)
    }

    // Add products based on discount type
    if (formData.discount_type === "products") {
      payload.product_ids = selectedProducts
    } else if (formData.discount_type === "categories") {
      payload.category_ids = formData.category_ids
    }

    // Add excluded products for global/category discounts
    if (formData.discount_type !== "products" && formData.excluded_product_ids.length > 0) {
      payload.excluded_product_ids = formData.excluded_product_ids
    }

    // Add optional fields
    if (formData.valid_from) payload.valid_from = formData.valid_from.toISOString()
    if (formData.valid_until) payload.valid_until = formData.valid_until.toISOString()
    if (formData.usage_limit) payload.usage_limit = parseInt(formData.usage_limit)
    if (formData.usage_limit_per_customer) {
      payload.usage_limit_per_customer = parseInt(formData.usage_limit_per_customer)
    }

    try {
      const url = editingDiscount 
        ? `/admin/volume-discounts/${editingDiscount.id}`
        : "/admin/volume-discounts"
      
      console.log("Submitting payload:", payload)
      
      const response = await fetch(url, {
        method: editingDiscount ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      console.log("Submit response status:", response.status)
      const result = await response.json()
      console.log("Submit response data:", result)

      if (response.ok) {
        showMessage('success', editingDiscount ? 'Discount updated successfully' : 'Discount created successfully')
        resetForm()
        fetchDiscounts()
      } else {
        showMessage('error', result.message || 'Failed to save discount')
      }
    } catch (error) {
      console.error("Submit error:", error)
      showMessage('error', 'Failed to save discount')
    }
  }

  const handleEdit = (discount: VolumeDiscount) => {
    setEditingDiscount(discount)
    
    // Extract product IDs from the discount
    const productIds = discount.products?.map(p => p.product_id) || []
    setSelectedProducts(productIds)
    
    setFormData({
      discount_type: discount.discount_type,
      min_quantity: discount.min_quantity.toString(),
      max_quantity: discount.max_quantity?.toString() || "",
      discount_value_type: discount.discount_value_type,
      discount_percentage: discount.discount_percentage?.toString() || "",
      discount_fixed_amount: discount.discount_fixed_amount?.toString() || "",
      title: discount.title,
      description: discount.description || "",
      is_active: discount.is_active,
      priority: discount.priority.toString(),
      valid_from: discount.valid_from ? new Date(discount.valid_from) : null,
      valid_until: discount.valid_until ? new Date(discount.valid_until) : null,
      usage_limit: discount.usage_limit?.toString() || "",
      usage_limit_per_customer: discount.usage_limit_per_customer?.toString() || "",
      category_ids: discount.category_ids || [],
      excluded_product_ids: discount.excluded_product_ids || []
    })
    setShowCreateModal(true)
  }

  const handleDelete = async (discountId: string) => {
    if (!confirm("Are you sure you want to delete this discount?")) return

    try {
      const response = await fetch(`/admin/volume-discounts/${discountId}`, {
        method: "DELETE"
      })
      
      if (response.ok) {
        showMessage('success', 'Discount deleted successfully')
        fetchDiscounts()
      } else {
        showMessage('error', 'Failed to delete discount')
      }
    } catch (error) {
      showMessage('error', 'Failed to delete discount')
    }
  }

  const resetForm = () => {
    setShowCreateModal(false)
    setEditingDiscount(null)
    setSelectedProducts([])
    setSearchTerm("")
    setFormData({
      discount_type: "products",
      min_quantity: "",
      max_quantity: "",
      discount_value_type: "percentage",
      discount_percentage: "",
      discount_fixed_amount: "",
      title: "",
      description: "",
      is_active: true,
      priority: "0",
      valid_from: null,
      valid_until: null,
      usage_limit: "",
      usage_limit_per_customer: "",
      category_ids: [],
      excluded_product_ids: []
    })
  }

  const getDiscountTypeIcon = (type: string) => {
    switch (type) {
      case "global": return <ShoppingCart size={14} />
      case "products": return <Package size={14} />
      case "categories": return <Tag size={14} />
      default: return null
    }
  }

  const getDiscountTypeLabel = (discount: VolumeDiscount) => {
    const icon = getDiscountTypeIcon(discount.discount_type)
    const label = {
      global: "Global",
      products: "Products",
      categories: "Categories"
    }[discount.discount_type]

    return (
      <Badge variant="default" className="gap-1">
        {icon}
        {label}
      </Badge>
    )
  }

  const getDiscountValue = (discount: VolumeDiscount) => {
    if (discount.discount_value_type === "percentage") {
      return `${discount.discount_percentage}%`
    } else {
      return `$${discount.discount_fixed_amount}`
    }
  }

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Container>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <Heading level="h1">Volume Discounts</Heading>
          <Text className="text-ui-fg-subtle mt-2">
            Manage quantity-based discounts for your products
          </Text>
        </div>
        <Button onClick={() => setShowCreateModal(true)} size="small">
          <Plus size={16} />
          Create Discount
        </Button>
      </div>

      {message && (
        <Alert variant={message.type === 'success' ? 'success' : 'error'} className="mb-6">
          {message.text}
        </Alert>
      )}

      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Title</Table.HeaderCell>
            <Table.HeaderCell>Type</Table.HeaderCell>
            <Table.HeaderCell>Quantity</Table.HeaderCell>
            <Table.HeaderCell>Discount</Table.HeaderCell>
            <Table.HeaderCell>Validity</Table.HeaderCell>
            <Table.HeaderCell>Usage</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {loading ? (
            <Table.Row>
              <Table.Cell colSpan={8} className="text-center py-8">
                <Text>Loading discounts...</Text>
              </Table.Cell>
            </Table.Row>
          ) : discounts.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan={8} className="text-center py-8">
                <Text>No discounts configured</Text>
              </Table.Cell>
            </Table.Row>
          ) : (
            discounts.map((discount) => (
              <Table.Row key={discount.id}>
                <Table.Cell>
                  <div>
                    <Text className="font-medium">{discount.title}</Text>
                    {discount.description && (
                      <Text className="text-sm text-ui-fg-subtle">{discount.description}</Text>
                    )}
                  </div>
                </Table.Cell>
                <Table.Cell>
                  {getDiscountTypeLabel(discount)}
                </Table.Cell>
                <Table.Cell>
                  <Text>
                    {discount.min_quantity}
                    {discount.max_quantity ? ` - ${discount.max_quantity}` : '+'} units
                  </Text>
                </Table.Cell>
                <Table.Cell>
                  <Text className="font-medium text-ui-fg-interactive">
                    {getDiscountValue(discount)}
                  </Text>
                </Table.Cell>
                <Table.Cell>
                  <div className="text-sm">
                    {discount.valid_from || discount.valid_until ? (
                      <>
                        {discount.valid_from && (
                          <Text>From: {new Date(discount.valid_from).toLocaleDateString()}</Text>
                        )}
                        {discount.valid_until && (
                          <Text>Until: {new Date(discount.valid_until).toLocaleDateString()}</Text>
                        )}
                      </>
                    ) : (
                      <Text className="text-ui-fg-subtle">No limit</Text>
                    )}
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <div className="text-sm">
                    {discount.usage_limit ? (
                      <Text>{discount.usage_count}/{discount.usage_limit}</Text>
                    ) : (
                      <Text className="text-ui-fg-subtle">Unlimited</Text>
                    )}
                  </div>
                </Table.Cell>
                <Table.Cell>
                  {discount.is_active ? (
                    <Badge variant="success">Active</Badge>
                  ) : (
                    <Badge variant="default">Inactive</Badge>
                  )}
                </Table.Cell>
                <Table.Cell>
                  <DropdownMenu>
                    <DropdownMenu.Trigger asChild>
                      <IconButton variant="transparent" size="small">
                        <MoreVertical size={16} />
                      </IconButton>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content>
                      <DropdownMenu.Item
                        onClick={() => handleEdit(discount)}
                        className="gap-x-2"
                      >
                        <Pencil size={16} />
                        Edit
                      </DropdownMenu.Item>
                      <DropdownMenu.Item
                        onClick={() => handleDelete(discount.id)}
                        className="gap-x-2 text-red-600"
                      >
                        <Trash size={16} />
                        Delete
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu>
                </Table.Cell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-ui-bg-base rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-6 border-b">
              <Heading level="h2">
                {editingDiscount ? 'Edit Discount' : 'Create Discount'}
              </Heading>
              <IconButton variant="transparent" onClick={resetForm}>
                <X size={20} />
              </IconButton>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-2 gap-6 p-6">
                {/* Left Column */}
                <div className="space-y-6">
                  <div>
                    <Heading level="h3" className="mb-4">Basic Information</Heading>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Discount Title *</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          placeholder="e.g., 10% off for 5+ items"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          placeholder="Internal description for this discount"
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Application Type *</Label>
                        <RadioGroup
                          value={formData.discount_type}
                          onValueChange={(value) => {
                            setFormData({ ...formData, discount_type: value as any })
                            setSelectedProducts([])
                          }}
                        >
                          <div className="space-y-2">
                            <label className="flex items-center gap-3 p-3 border rounded-md cursor-pointer hover:bg-ui-bg-subtle">
                              <RadioGroup.Item value="products" />
                              <div className="flex items-center gap-2">
                                <Package size={16} />
                                <div>
                                  <Text className="font-medium">Specific Products</Text>
                                  <Text className="text-sm text-ui-fg-subtle">
                                    Apply only to selected products
                                  </Text>
                                </div>
                              </div>
                            </label>
                            <label className="flex items-center gap-3 p-3 border rounded-md cursor-pointer hover:bg-ui-bg-subtle">
                              <RadioGroup.Item value="categories" />
                              <div className="flex items-center gap-2">
                                <Tag size={16} />
                                <div>
                                  <Text className="font-medium">Categories</Text>
                                  <Text className="text-sm text-ui-fg-subtle">
                                    Apply to all products in selected categories
                                  </Text>
                                </div>
                              </div>
                            </label>
                            <label className="flex items-center gap-3 p-3 border rounded-md cursor-pointer hover:bg-ui-bg-subtle">
                              <RadioGroup.Item value="global" />
                              <div className="flex items-center gap-2">
                                <ShoppingCart size={16} />
                                <div>
                                  <Text className="font-medium">Global</Text>
                                  <Text className="text-sm text-ui-fg-subtle">
                                    Apply to all products in the store
                                  </Text>
                                </div>
                              </div>
                            </label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Heading level="h3" className="mb-4">Discount Configuration</Heading>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="min_quantity">Minimum Quantity *</Label>
                          <Input
                            id="min_quantity"
                            type="number"
                            value={formData.min_quantity}
                            onChange={(e) => setFormData({ ...formData, min_quantity: e.target.value })}
                            placeholder="5"
                            min="1"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="max_quantity">Maximum Quantity</Label>
                          <Input
                            id="max_quantity"
                            type="number"
                            value={formData.max_quantity}
                            onChange={(e) => setFormData({ ...formData, max_quantity: e.target.value })}
                            placeholder="No limit"
                            min="1"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Discount Type *</Label>
                        <RadioGroup
                          value={formData.discount_value_type}
                          onValueChange={(value) => setFormData({ ...formData, discount_value_type: value as any })}
                        >
                          <div className="flex gap-4">
                            <label className="flex items-center gap-2">
                              <RadioGroup.Item value="percentage" />
                              <Text>Percentage</Text>
                            </label>
                            <label className="flex items-center gap-2">
                              <RadioGroup.Item value="fixed" />
                              <Text>Fixed Amount</Text>
                            </label>
                          </div>
                        </RadioGroup>
                      </div>

                      {formData.discount_value_type === "percentage" ? (
                        <div className="space-y-2">
                          <Label htmlFor="discount_percentage">Discount Percentage *</Label>
                          <Input
                            id="discount_percentage"
                            type="number"
                            value={formData.discount_percentage}
                            onChange={(e) => setFormData({ ...formData, discount_percentage: e.target.value })}
                            placeholder="10"
                            min="0"
                            max="100"
                            step="0.01"
                            required
                          />
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Label htmlFor="discount_fixed_amount">Fixed Amount ($) *</Label>
                          <Input
                            id="discount_fixed_amount"
                            type="number"
                            value={formData.discount_fixed_amount}
                            onChange={(e) => setFormData({ ...formData, discount_fixed_amount: e.target.value })}
                            placeholder="50.00"
                            min="0"
                            step="0.01"
                            required
                          />
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="priority">Priority</Label>
                        <Input
                          id="priority"
                          type="number"
                          value={formData.priority}
                          onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                          placeholder="0"
                          min="0"
                        />
                        <Text className="text-sm text-ui-fg-subtle">
                          Higher number = higher priority when applying discounts
                        </Text>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {formData.discount_type === "products" && (
                    <div>
                      <Heading level="h3" className="mb-4">Product Selection</Heading>
                      
                      <div className="space-y-4">
                        <Input
                          placeholder="Search products..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        
                        <div className="border rounded-md max-h-64 overflow-y-auto">
                          {filteredProducts.length === 0 ? (
                            <div className="p-4 text-center text-ui-fg-subtle">
                              No products found
                            </div>
                          ) : (
                            <div className="divide-y">
                              {filteredProducts.map((product) => (
                                <label
                                  key={product.id}
                                  className="flex items-center gap-3 p-3 hover:bg-ui-bg-subtle cursor-pointer"
                                >
                                  <Checkbox
                                    checked={selectedProducts.includes(product.id)}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        setSelectedProducts([...selectedProducts, product.id])
                                      } else {
                                        setSelectedProducts(selectedProducts.filter(id => id !== product.id))
                                      }
                                    }}
                                  />
                                  <div className="flex items-center gap-3 flex-1">
                                    {product.thumbnail && (
                                      <img
                                        src={product.thumbnail}
                                        alt={product.title}
                                        className="w-10 h-10 rounded object-cover"
                                      />
                                    )}
                                    <div>
                                      <Text className="font-medium">{product.title}</Text>
                                      <Text className="text-sm text-ui-fg-subtle">
                                        {product.variants?.length || 0} variants
                                      </Text>
                                    </div>
                                  </div>
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        <Text className="text-sm text-ui-fg-subtle">
                          {selectedProducts.length} products selected
                        </Text>
                      </div>
                    </div>
                  )}

                  <div>
                    <Heading level="h3" className="mb-4">Restrictions</Heading>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Validity Period</Label>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="valid_from" className="text-sm">From</Label>
                            <Input
                              id="valid_from"
                              type="datetime-local"
                              value={formData.valid_from ? formData.valid_from.toISOString().slice(0, 16) : ""}
                              onChange={(e) => setFormData({ 
                                ...formData, 
                                valid_from: e.target.value ? new Date(e.target.value) : null 
                              })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="valid_until" className="text-sm">Until</Label>
                            <Input
                              id="valid_until"
                              type="datetime-local"
                              value={formData.valid_until ? formData.valid_until.toISOString().slice(0, 16) : ""}
                              onChange={(e) => setFormData({ 
                                ...formData, 
                                valid_until: e.target.value ? new Date(e.target.value) : null 
                              })}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="usage_limit">Total Usage Limit</Label>
                          <Input
                            id="usage_limit"
                            type="number"
                            value={formData.usage_limit}
                            onChange={(e) => setFormData({ ...formData, usage_limit: e.target.value })}
                            placeholder="Unlimited"
                            min="1"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="usage_limit_per_customer">Per Customer</Label>
                          <Input
                            id="usage_limit_per_customer"
                            type="number"
                            value={formData.usage_limit_per_customer}
                            onChange={(e) => setFormData({ ...formData, usage_limit_per_customer: e.target.value })}
                            placeholder="Unlimited"
                            min="1"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Status</Label>
                        <div className="flex items-center gap-3 p-3 bg-ui-bg-subtle rounded-md">
                          <Switch
                            id="is_active"
                            checked={formData.is_active}
                            onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                          />
                          <Label htmlFor="is_active" className="font-normal cursor-pointer">
                            Discount active
                          </Label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Preview */}
                  <div className="bg-ui-bg-subtle rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertCircle size={16} className="text-ui-fg-subtle" />
                      <Text className="font-medium">Preview</Text>
                    </div>
                    <div className="space-y-2 text-sm">
                      <Text>
                        {formData.discount_type === "global" && "Applies to all products"}
                        {formData.discount_type === "products" && `Applies to ${selectedProducts.length} products`}
                        {formData.discount_type === "categories" && "Applies to selected categories"}
                      </Text>
                      <Text>
                        Quantity: {formData.min_quantity || "?"} 
                        {formData.max_quantity ? ` - ${formData.max_quantity}` : "+"} units
                      </Text>
                      <Text>
                        Discount: {
                          formData.discount_value_type === "percentage" 
                            ? `${formData.discount_percentage || "?"}%`
                            : `$${formData.discount_fixed_amount || "?"}`
                        }
                      </Text>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 p-6 border-t bg-ui-bg-subtle">
                <Button type="submit" className="flex-1" size="base" disabled={
                  !formData.title || !formData.min_quantity || 
                  (formData.discount_value_type === "percentage" && !formData.discount_percentage) ||
                  (formData.discount_value_type === "fixed" && !formData.discount_fixed_amount) ||
                  (formData.discount_type === "products" && selectedProducts.length === 0)
                }>
                  {editingDiscount ? 'Update' : 'Create'} Discount
                </Button>
                <Button type="button" variant="secondary" onClick={resetForm} size="base">
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Volume Discounts",
  icon: Percent,
})

export default VolumeDiscountsPage