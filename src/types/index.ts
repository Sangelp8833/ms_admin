export type OrderStatus = 'received' | 'preparing' | 'shipped' | 'delivered'
export type ProductType = 'standard' | 'sponsored'

export interface SponsorInfo {
  name: string
  logoUrl: string
  tagline: string
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  imageUrls: string[]
  categoryId: string
  categoryName: string
  type: ProductType
  sponsorInfo?: SponsorInfo
  inStock: boolean
  deletedAt: string | null
}

export interface Category {
  id: string
  name: string
  slug: string
}

export interface OrderItem {
  productId: string
  name: string
  price: number
  quantity: number
  imageUrl: string
}

export interface Order {
  id: string
  trackingCode: string
  status: OrderStatus
  items: OrderItem[]
  total: number
  address: string
  customerName: string
  customerEmail: string
  createdAt: string
  updatedAt: string
}

export interface PaginationMeta {
  total: number
  page: number
  perPage: number
}

export interface SalesByMonth {
  month: string
  totalAmount: number
  orderCount: number
}

export interface TopProduct {
  productId: string
  name: string
  unitsSold: number
  revenue: number
}

export interface DashboardStats {
  monthlySales: number
  activeOrders: number
  activeProducts: number
  pendingOrders: number
}
