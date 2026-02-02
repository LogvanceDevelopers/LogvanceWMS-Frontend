import apiClient from './client'

export interface Product {
  id: string
  tenantId: string
  sku: string
  barcode: string
  name: string
  description?: string
  dimensions?: {
    width: number
    height: number
    depth: number
    weight: number
  }
  minStockLevel: number
  maxStockLevel: number
  requiresColdStorage: boolean
  requiresSerialTracking: boolean
  requiresBatchTracking: boolean
  salesVelocity: 'Low' | 'Medium' | 'High'
  createdAt: string
}

export interface CreateProductRequest {
  sku: string
  barcode: string
  name: string
  description?: string
  dimensions?: {
    width: number
    height: number
    depth: number
    weight: number
  }
  minStockLevel: number
  maxStockLevel: number
  requiresColdStorage: boolean
  requiresSerialTracking: boolean
  requiresBatchTracking: boolean
  salesVelocity: 'Low' | 'Medium' | 'High'
}

export const productsApi = {
  getAll: async (): Promise<Product[]> => {
    const response = await apiClient.get<Product[]>('/products')
    return response.data
  },

  getById: async (id: string): Promise<Product> => {
    const response = await apiClient.get<Product>(`/products/${id}`)
    return response.data
  },

  create: async (data: CreateProductRequest): Promise<Product> => {
    const response = await apiClient.post<Product>('/products', data)
    return response.data
  },
}

