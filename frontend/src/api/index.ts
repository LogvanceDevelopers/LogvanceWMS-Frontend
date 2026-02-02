// ============================================
// LOGVANCE WMS - API Services
// ============================================

import axios, { AxiosInstance, AxiosError } from 'axios';
import type {
  LoginRequest,
  LoginResponse,
  Order,
  OrderFilter,
  Product,
  ProductFilter,
  InventoryItem,
  InventoryFilter,
  Tenant,
  Warehouse,
  Location,
  User,
  CargoCompany,
  DashboardStats,
  TenantOrderSummary,
  UserPerformance,
  PaginatedResponse,
  ApiResponse,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle 401
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ============================================
// AUTH API
// ============================================
export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', data);
    return response.data;
  },

  refresh: async (refreshToken: string): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/refresh', { refreshToken });
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },
};

// ============================================
// DASHBOARD API
// ============================================
export const dashboardApi = {
  getStats: async (period: 'daily' | 'weekly' | 'monthly' = 'daily'): Promise<DashboardStats> => {
    const response = await api.get<DashboardStats>('/dashboard/stats', { params: { period } });
    return response.data;
  },

  getTenantOrderSummary: async (period: 'daily' | 'weekly' | 'monthly' = 'daily'): Promise<TenantOrderSummary[]> => {
    const response = await api.get<TenantOrderSummary[]>('/dashboard/tenant-orders', { params: { period } });
    return response.data;
  },

  getUserPerformance: async (period: 'daily' | 'weekly' | 'monthly' = 'daily'): Promise<UserPerformance[]> => {
    const response = await api.get<UserPerformance[]>('/dashboard/user-performance', { params: { period } });
    return response.data;
  },
};

// ============================================
// ORDERS API
// ============================================
export const ordersApi = {
  getAll: async (filter?: OrderFilter, page = 1, pageSize = 50): Promise<PaginatedResponse<Order>> => {
    const response = await api.get<PaginatedResponse<Order>>('/orders', {
      params: { ...filter, page, pageSize },
    });
    return response.data;
  },

  getById: async (id: string): Promise<Order> => {
    const response = await api.get<Order>(`/orders/${id}`);
    return response.data;
  },

  create: async (data: Partial<Order>): Promise<Order> => {
    const response = await api.post<Order>('/orders', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Order>): Promise<Order> => {
    const response = await api.put<Order>(`/orders/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/orders/${id}`);
  },

  updateStatus: async (id: string, status: number): Promise<Order> => {
    const response = await api.patch<Order>(`/orders/${id}/status`, { status });
    return response.data;
  },

  approve: async (id: string): Promise<Order> => {
    const response = await api.post<Order>(`/orders/${id}/approve`);
    return response.data;
  },

  cancel: async (id: string, reason?: string): Promise<Order> => {
    const response = await api.post<Order>(`/orders/${id}/cancel`, { reason });
    return response.data;
  },

  getOrderHistory: async (id: string): Promise<any> => {
    const response = await api.get(`/orders/${id}/history`);
    return response.data;
  },

  exportToExcel: async (filter?: OrderFilter): Promise<Blob> => {
    const response = await api.get('/orders/export', {
      params: filter,
      responseType: 'blob',
    });
    return response.data;
  },

  getStatusSummary: async (filter?: OrderFilter): Promise<any[]> => {
    const response = await api.get('/orders/status-summary', { params: filter });
    return response.data;
  },
};

// ============================================
// PRODUCTS API
// ============================================
export const productsApi = {
  getAll: async (filter?: ProductFilter, page = 1, pageSize = 50): Promise<PaginatedResponse<Product>> => {
    const response = await api.get<PaginatedResponse<Product>>('/products', {
      params: { ...filter, page, pageSize },
    });
    return response.data;
  },

  getById: async (id: string): Promise<Product> => {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  },

  getByBarcode: async (barcode: string): Promise<Product> => {
    const response = await api.get<Product>(`/products/barcode/${barcode}`);
    return response.data;
  },

  create: async (data: Partial<Product>): Promise<Product> => {
    const response = await api.post<Product>('/products', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Product>): Promise<Product> => {
    const response = await api.put<Product>(`/products/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
  },

  getLowStock: async (): Promise<Product[]> => {
    const response = await api.get<Product[]>('/products/low-stock');
    return response.data;
  },
};

// ============================================
// INVENTORY API
// ============================================
export const inventoryApi = {
  getAll: async (filter?: InventoryFilter, page = 1, pageSize = 50): Promise<PaginatedResponse<InventoryItem>> => {
    const response = await api.get<PaginatedResponse<InventoryItem>>('/inventory', {
      params: { ...filter, page, pageSize },
    });
    return response.data;
  },

  getById: async (id: string): Promise<InventoryItem> => {
    const response = await api.get<InventoryItem>(`/inventory/${id}`);
    return response.data;
  },

  getByProduct: async (productId: string): Promise<InventoryItem[]> => {
    const response = await api.get<InventoryItem[]>(`/inventory/product/${productId}`);
    return response.data;
  },

  getByLocation: async (locationId: string): Promise<InventoryItem[]> => {
    const response = await api.get<InventoryItem[]>(`/inventory/location/${locationId}`);
    return response.data;
  },

  adjust: async (id: string, quantity: number, reason: string): Promise<InventoryItem> => {
    const response = await api.post<InventoryItem>(`/inventory/${id}/adjust`, { quantity, reason });
    return response.data;
  },

  transfer: async (fromId: string, toLocationId: string, quantity: number): Promise<void> => {
    await api.post('/inventory/transfer', { fromId, toLocationId, quantity });
  },

  receive: async (data: Partial<InventoryItem>): Promise<InventoryItem> => {
    const response = await api.post<InventoryItem>('/inventory/receive', data);
    return response.data;
  },
};

// ============================================
// TENANTS API (Cari Kartlar)
// ============================================
export const tenantsApi = {
  getAll: async (search?: string): Promise<Tenant[]> => {
    const response = await api.get<Tenant[]>('/tenants', { params: { search } });
    return response.data;
  },

  getById: async (id: string): Promise<Tenant> => {
    const response = await api.get<Tenant>(`/tenants/${id}`);
    return response.data;
  },

  create: async (data: Partial<Tenant>): Promise<Tenant> => {
    const response = await api.post<Tenant>('/tenants', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Tenant>): Promise<Tenant> => {
    const response = await api.put<Tenant>(`/tenants/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/tenants/${id}`);
  },
};

// ============================================
// WAREHOUSES API (Depolar)
// ============================================
export const warehousesApi = {
  getAll: async (): Promise<Warehouse[]> => {
    const response = await api.get<Warehouse[]>('/warehouses');
    return response.data;
  },

  getById: async (id: string): Promise<Warehouse> => {
    const response = await api.get<Warehouse>(`/warehouses/${id}`);
    return response.data;
  },

  create: async (data: Partial<Warehouse>): Promise<Warehouse> => {
    const response = await api.post<Warehouse>('/warehouses', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Warehouse>): Promise<Warehouse> => {
    const response = await api.put<Warehouse>(`/warehouses/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/warehouses/${id}`);
  },
};

// ============================================
// LOCATIONS API (Raflar)
// ============================================
export const locationsApi = {
  getAll: async (warehouseId?: string): Promise<Location[]> => {
    const response = await api.get<Location[]>('/locations', { params: { warehouseId } });
    return response.data;
  },

  getById: async (id: string): Promise<Location> => {
    const response = await api.get<Location>(`/locations/${id}`);
    return response.data;
  },

  getByCode: async (code: string): Promise<Location> => {
    const response = await api.get<Location>(`/locations/code/${code}`);
    return response.data;
  },

  create: async (data: Partial<Location>): Promise<Location> => {
    const response = await api.post<Location>('/locations', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Location>): Promise<Location> => {
    const response = await api.put<Location>(`/locations/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/locations/${id}`);
  },
};

// ============================================
// USERS API (Kullanıcılar)
// ============================================
export const usersApi = {
  getAll: async (): Promise<User[]> => {
    const response = await api.get<User[]>('/users');
    return response.data;
  },

  getById: async (id: string): Promise<User> => {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },

  create: async (data: Partial<User> & { password: string }): Promise<User> => {
    const response = await api.post<User>('/users', data);
    return response.data;
  },

  update: async (id: string, data: Partial<User>): Promise<User> => {
    const response = await api.put<User>(`/users/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },

  changePassword: async (id: string, currentPassword: string, newPassword: string): Promise<void> => {
    await api.post(`/users/${id}/change-password`, { currentPassword, newPassword });
  },
};

// ============================================
// CARGO COMPANIES API (Kargo Şirketleri)
// ============================================
export const cargoCompaniesApi = {
  getAll: async (): Promise<CargoCompany[]> => {
    const response = await api.get<CargoCompany[]>('/cargo-companies');
    return response.data;
  },

  getById: async (id: string): Promise<CargoCompany> => {
    const response = await api.get<CargoCompany>(`/cargo-companies/${id}`);
    return response.data;
  },

  create: async (data: Partial<CargoCompany>): Promise<CargoCompany> => {
    const response = await api.post<CargoCompany>('/cargo-companies', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CargoCompany>): Promise<CargoCompany> => {
    const response = await api.put<CargoCompany>(`/cargo-companies/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/cargo-companies/${id}`);
  },

  sendToCargo: async (orderId: string): Promise<{ trackingNumber: string }> => {
    const response = await api.post<{ trackingNumber: string }>(`/cargo-companies/send/${orderId}`);
    return response.data;
  },
};

export default api;

