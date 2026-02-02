// ============================================
// LOGVANCE WMS - TypeScript Types
// ============================================

// Base Entity
export interface BaseEntity {
  id: string;
  isActive: boolean;
  isDeleted: boolean;
  createDate: string;
  createdBy?: string;
  updateDate?: string;
  updatedBy?: string;
}

// User / Kullanıcı
export interface User extends BaseEntity {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  tenantId: string;
  profileImage?: string;
}

export enum UserRole {
  Admin = 0,
  Manager = 1,
  Operator = 2,
  Viewer = 3
}

// Tenant / Cari Kart
export interface Tenant extends BaseEntity {
  code: string;
  name: string;
  taxNumber?: string;
  address?: string;
  phone?: string;
  email?: string;
  logoUrl?: string;
}

// Warehouse / Depo
export interface Warehouse extends BaseEntity {
  tenantId: string;
  code: string;
  name: string;
  address?: string;
}

// Location / Raf
export interface Location extends BaseEntity {
  warehouseId: string;
  code: string;
  name: string;
  aisle?: string;
  row?: string;
  level?: string;
  position?: string;
  locationType: LocationType;
}

export enum LocationType {
  Storage = 0,
  Picking = 1,
  Receiving = 2,
  Shipping = 3,
  Staging = 4
}

// Product / Stok Kartı
export interface Product extends BaseEntity {
  tenantId: string;
  sku: string;
  barcode: string;
  name: string;
  description?: string;
  category?: string;
  brand?: string;
  weight?: number;
  width?: number;
  height?: number;
  depth?: number;
  unitOfMeasure: string;
  minStockLevel: number;
  maxStockLevel: number;
  reorderPoint: number;
  imageUrl?: string;
}

// Order / Sipariş
export interface Order extends BaseEntity {
  tenantId: string;
  warehouseId: string;
  orderNumber: string;
  externalOrderNumber?: string;
  customerName: string;
  customerAddress?: string;
  customerPhone?: string;
  customerEmail?: string;
  orderType: OrderType;
  status: OrderStatus;
  priority: number;
  orderDate: string;
  expectedShipDate?: string;
  shippedDate?: string;
  notes?: string;
  cargoCompanyId?: string;
  cargoTrackingNumber?: string;
  cargoStatus?: CargoStatus;
  orderLines: OrderLine[];
}

export enum OrderType {
  Inbound = 0,
  Outbound = 1,
  Transfer = 2
}

export enum OrderStatus {
  Pending = 0,           // Sipariş Alındı
  Confirmed = 1,         // Onaylandı
  Processing = 2,        // Hazırlanıyor
  Picking = 3,           // Toplanıyor
  Packing = 4,           // Paketleniyor
  Packed = 5,            // Paketlendi
  Shipped = 6,           // Kargoya Verildi
  Completed = 7,         // Tamamlandı
  Cancelled = 8,         // İptal
  InvoiceOnly = 9        // Sadece Fatura
}

export enum CargoStatus {
  Pending = 0,
  Sent = 1,
  Error = 2
}

// Order Line / Sipariş Detayı
export interface OrderLine extends BaseEntity {
  orderId: string;
  productId: string;
  sku: string;
  productName: string;
  quantity: number;
  pickedQuantity: number;
  packedQuantity: number;
  unitPrice?: number;
  notes?: string;
  product?: Product;
}

// Inventory Item / Stok
export interface InventoryItem extends BaseEntity {
  warehouseId: string;
  locationId: string;
  productId: string;
  quantity: number;
  lotNumber?: string;
  batchNumber?: string;
  serialNumber?: string;
  expirationDate?: string;
  receivedDate: string;
  status: InventoryStatus;
  location?: Location;
  product?: Product;
}

export enum InventoryStatus {
  Available = 0,
  Reserved = 1,
  Damaged = 2,
  Quarantine = 3
}

// Cargo Company / Kargo Şirketi
export interface CargoCompany extends BaseEntity {
  code: string;
  name: string;
  apiUrl?: string;
  apiKey?: string;
  isIntegrated: boolean;
}

// Work Task / İş Görevi
export interface WorkTask extends BaseEntity {
  tenantId: string;
  warehouseId: string;
  orderId?: string;
  assignedUserId?: string;
  taskType: TaskType;
  status: TaskStatus;
  priority: number;
  fromLocationId?: string;
  toLocationId?: string;
  productId?: string;
  quantity: number;
  completedQuantity: number;
  startedAt?: string;
  completedAt?: string;
  assignedUser?: User;
}

export enum TaskType {
  Receiving = 0,
  Putaway = 1,
  Picking = 2,
  Packing = 3,
  Shipping = 4,
  Counting = 5,
  Transfer = 6
}

export enum TaskStatus {
  Pending = 0,
  Assigned = 1,
  InProgress = 2,
  Completed = 3,
  Cancelled = 4
}

// Dashboard Stats
export interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  packingOrders: number;
  packedOrders: number;
  shippedOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
}

export interface TenantOrderSummary {
  tenantId: string;
  tenantName: string;
  tenantLogo?: string;
  pendingCount: number;
  processingCount: number;
  packingCount: number;
  packedCount: number;
}

export interface UserPerformance {
  userId: string;
  userName: string;
  userImage?: string;
  pickingCount: number;
  orderCount: number;
  itemCount: number;
}

// Filter Types
export interface OrderFilter {
  startDate?: string;
  endDate?: string;
  status?: OrderStatus;
  tenantId?: string;
  cargoCompanyId?: string;
  userId?: string;
  orderSourceId?: string;
  cargoStatus?: CargoStatus;
  search?: string;
}

export interface ProductFilter {
  search?: string;
  category?: string;
  tenantId?: string;
  lowStock?: boolean;
}

export interface InventoryFilter {
  warehouseId?: string;
  locationId?: string;
  productId?: string;
  status?: InventoryStatus;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

// Auth Types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: User;
  expiresAt: string;
}

