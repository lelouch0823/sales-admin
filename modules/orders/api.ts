/**
 * 订单管理 API
 *
 * 对接后端 /orders 接口
 */

import {
  Order,
  OrderStatus,
  OrderStats,
  OrderItem,
  OrderLog,
  CreateOrderRequest,
  BatchUpdateOrderStatusRequest,
  BatchUpdateResult,
} from './types';
import { http } from '../../lib/http';
import { createApiWithStats, BaseFilterParams } from '../../lib/api-factory';

// ============ 类型定义 ============

/** 订单筛选参数 */
export interface OrderFilterParams extends BaseFilterParams {
  customerId?: string;
  dateFrom?: string;
  dateTo?: string;
  minAmount?: number;
  maxAmount?: number;
}

/** 更新订单状态请求 */
export interface UpdateOrderStatusRequest {
  status: OrderStatus;
  notes?: string;
}

// ============ API 实例 ============

// 使用工厂创建基础 API
const baseApi = createApiWithStats<
  Order,
  OrderStats,
  CreateOrderRequest,
  Partial<Order>,
  OrderFilterParams
>('/orders');

// 扩展订单特有方法
export const orderApi = {
  ...baseApi,

  /**
   * 更新订单状态
   */
  updateStatus: async (id: string, data: UpdateOrderStatusRequest): Promise<Order> => {
    return http.patch<Order>(`/orders/${id}/status`, data);
  },

  /**
   * 批量更新订单状态
   */
  batchUpdateStatus: async (data: BatchUpdateOrderStatusRequest): Promise<BatchUpdateResult> => {
    return http.patch<BatchUpdateResult>('/orders/batch-status', data);
  },

  /**
   * 获取订单商品明细
   */
  getItems: async (id: string): Promise<OrderItem[]> => {
    return http.get<OrderItem[]>(`/orders/${id}/items`);
  },

  /**
   * 获取订单操作日志
   */
  getLogs: async (id: string): Promise<OrderLog[]> => {
    return http.get<OrderLog[]>(`/orders/${id}/logs`);
  },
};
