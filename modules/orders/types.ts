/**
 * 订单类型定义
 *
 * 对应后端 /orders 接口
 */

// ============ 枚举类型 ============

/** 订单状态 */
export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded'
  | 'failed'
  | 'returned';

/** 支付状态 */
export type PaymentStatus = 'pending' | 'paid' | 'refunded';

/** 发货状态 */
export type ShippingStatus = 'pending' | 'shipped' | 'delivered' | 'returned';

// ============ 实体类型 ============

/** 订单项 */
export interface OrderItem {
  productId: string;
  productName: string;
  sku?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

/** 订单实体 */
export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  status: OrderStatus;
  paymentStatus?: PaymentStatus;
  shippingStatus?: ShippingStatus;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress?: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

/** 订单统计 */
export interface OrderStats {
  totalOrders: number;
  total: number;
  totalRevenue: number;
  averageOrderValue: number;
  todayOrders: number;
  weekOrders: number;
  monthOrders: number;
  byStatus: Record<OrderStatus, number>;
  byPaymentStatus: Record<PaymentStatus, number>;
  byShippingStatus: Record<ShippingStatus, number>;
  recentOrders: Order[];
  topCustomers: Array<{
    customerId: string;
    orderCount: number;
    totalSpent: number;
  }>;
}

/** 订单操作日志 */
export interface OrderLog {
  id: string;
  action: string;
  fromStatus?: OrderStatus;
  toStatus?: OrderStatus;
  operator: {
    id: string;
    name: string;
  };
  notes?: string;
  createdAt: string;
}

/** 创建订单请求 */
export interface CreateOrderRequest {
  customerId: string;
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  shippingAddress: {
    province: string;
    city: string;
    district: string;
    address: string;
    zipCode?: string;
    receiverName: string;
    receiverPhone: string;
  };
  notes?: string;
}

/** 批量更新订单状态请求 */
export interface BatchUpdateOrderStatusRequest {
  orderIds: string[];
  status: OrderStatus;
  notes?: string;
}

/** 批量更新结果 */
export interface BatchUpdateResult {
  updatedCount: number;
  failedCount: number;
}

/** 订单筛选参数 */
export interface OrderFilterParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
}
