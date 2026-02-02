import apiClient from './client'

export type OrderStatus = 
  | 'Created' 
  | 'Approved' 
  | 'Picking' 
  | 'Packing' 
  | 'Shipped' 
  | 'Delivered' 
  | 'Cancelled' 
  | 'Returned'

export interface Order {
  id: string
  tenantId: string
  orderNumber: string
  marketplaceName: string
  marketplaceOrderId: string
  customerInfo: {
    name: string
    email: string
    phone: string
    address: string
    city: string
    district: string
    postalCode: string
    country: string
  }
  status: OrderStatus
  priorityScore: number
  cutoffTime?: string
  orderDate: string
  shippedDate?: string
  deliveredDate?: string
  trackingNumber?: string
  carrierCode?: string
  totalAmount: number
  shippingAmount: number
  notes?: string
  orderLines: OrderLine[]
  createdAt: string
}

export interface OrderLine {
  id: string
  productId: string
  productName?: string
  productSku?: string
  quantity: number
  pickedQuantity: number
  packedQuantity: number
  unitPrice: number
  totalPrice: number
  assignedLocationId?: string
  notes?: string
}

export const ordersApi = {
  getAll: async (status?: OrderStatus): Promise<Order[]> => {
    const params = status ? { status } : {}
    const response = await apiClient.get<Order[]>('/orders', { params })
    return response.data
  },

  getById: async (id: string): Promise<Order> => {
    const response = await apiClient.get<Order>(`/orders/${id}`)
    return response.data
  },

  updateStatus: async (id: string, status: OrderStatus, trackingNumber?: string, carrierCode?: string): Promise<Order> => {
    const response = await apiClient.patch<Order>(`/orders/${id}/status`, {
      status,
      trackingNumber,
      carrierCode,
    })
    return response.data
  },
}

