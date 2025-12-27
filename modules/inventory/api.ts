/**
 * 库存管理 API
 *
 * 对接后端 /inventory 接口
 */

import { InventoryBalance, InventoryMovement } from './types';
import { http, HttpError } from '../../lib/http';
import { createApiWithStats, BaseFilterParams } from '../../lib/api-factory';

// ============ 类型定义 ============

/** 库存筛选参数 */
export interface InventoryFilterParams extends BaseFilterParams {
  productId?: string;
  warehouseId?: string;
  locationId?: string;
  lowStock?: boolean;
  outOfStock?: boolean;
  expiringSoon?: boolean;
  minQuantity?: number;
  maxQuantity?: number;
}

/** 库存统计 */
export interface InventoryStats {
  totalProducts: number;
  totalQuantity: number;
  totalValue: number;
  lowStockItems: number;
  outOfStockItems: number;
  expiringSoonItems: number;
  damagedItems: number;
  byStatus: Record<string, number>;
  activeAlerts: number;
  alertsByType: Record<string, number>;
}

/** 库存调整请求 */
export interface AdjustInventoryRequest {
  inventoryId: string;
  newQuantity: number;
  reason: string;
  notes?: string;
  unitCost?: number;
}

/** 库存转移请求 */
export interface TransferInventoryRequest {
  fromInventoryId: string;
  toInventoryId: string;
  quantity: number;
  reason: string;
  notes?: string;
}

/** 库存预留请求 */
export interface ReserveInventoryRequest {
  productId: string;
  quantity: number;
  orderId: string;
  reason?: string;
}

// ============ API 实例 ============

// 使用工厂创建基础 CRUD API
const baseApi = createApiWithStats<
  InventoryBalance,
  InventoryStats,
  Partial<InventoryBalance>,
  Partial<InventoryBalance>,
  InventoryFilterParams
>('/inventory', 'inventory'); // 启用 mock

import { db } from '../../lib/db';
import { USE_MOCK_API } from '../../lib/api-factory';

// 扩展库存特有方法
export const inventoryApi = {
  ...baseApi,

  // 覆盖 list 方法，使用具体的业务名称
  getBalances: baseApi.list,

  /**
   * 获取库存变动记录
   */
  getMovements: async (inventoryId?: string): Promise<InventoryMovement[]> => {
    if (USE_MOCK_API) {
      await new Promise(r => setTimeout(r, 400));
      const all = db.get('movements') as InventoryMovement[];
      if (inventoryId) return all.filter(m => m.inventoryId === inventoryId);
      return all;
    }
    if (inventoryId) {
      return http.get<InventoryMovement[]>(`/inventory/${inventoryId}/movements`);
    }
    return http.get<InventoryMovement[]>('/inventory/movements');
  },

  /**
   * 调整库存数量
   */
  adjust: async (data: AdjustInventoryRequest): Promise<void> => {
    await http.post('/inventory/adjust', data);
  },

  /**
   * 库存转移
   */
  transfer: async (data: TransferInventoryRequest): Promise<void> => {
    await http.post('/inventory/transfer', data);
  },

  /**
   * 预留库存
   */
  reserve: async (data: ReserveInventoryRequest): Promise<void> => {
    await http.post('/inventory/reserve', data);
  },

  /**
   * 获取低库存列表
   */
  getLowStock: async (): Promise<InventoryBalance[]> => {
    return http.get<InventoryBalance[]>('/inventory/low-stock');
  },

  /**
   * 获取即将过期商品
   */
  getExpiringSoon: async (days = 30): Promise<InventoryBalance[]> => {
    return http.get<InventoryBalance[]>('/inventory/expiring-soon', {
      params: { days },
    });
  },

  /**
   * 获取库存价值报告
   */
  getValueReport: async (): Promise<unknown> => {
    return http.get('/inventory/value-report');
  },

  /**
   * 获取活跃预警
   */
  getActiveAlerts: async (): Promise<unknown[]> => {
    return http.get<unknown[]>('/inventory/alerts/active');
  },
};

// 导出错误类型
export { HttpError };
