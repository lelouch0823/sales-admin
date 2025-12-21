/**
 * 仓库管理 API
 *
 * 对接后端 /admin/warehouses 和 /admin/transfer-orders 接口
 */

import { Warehouse, WarehouseType, TransferOrder, TransferPriority } from './types';
import { http } from '../../lib/http';
import { createCrudApi, BaseFilterParams, PaginatedResponse } from '../../lib/api-factory';

// ============ 类型定义 ============

/** 仓库筛选参数 */
export interface WarehouseFilterParams extends BaseFilterParams {
  type?: WarehouseType;
  tenantId?: string;
  parentId?: string;
  regionCode?: string;
  isActive?: boolean;
  keyword?: string;
}

/** 创建调货单请求 */
export interface CreateTransferOrderRequest {
  sourceWarehouseId: string;
  targetWarehouseId: string;
  items: Array<{ productId: string; quantity: number }>;
  expectedArrival?: string;
  notes?: string;
  priority?: TransferPriority;
}

/** 收货确认请求 */
export interface ReceiveTransferOrderRequest {
  items: Array<{
    productId: string;
    receivedQuantity: number;
    notes?: string;
  }>;
}

// ============ 仓库 API ============

// 使用工厂创建基础 CRUD API
const baseWarehouseApi = createCrudApi<
  Warehouse,
  Partial<Warehouse>,
  Partial<Warehouse>,
  WarehouseFilterParams
>('/admin/warehouses');

export const warehouseApi = {
  ...baseWarehouseApi,

  /**
   * 获取仓库列表（带分页）
   */
  listPaginated: async (params?: WarehouseFilterParams): Promise<PaginatedResponse<Warehouse>> => {
    const response = await http.get<{
      items: Warehouse[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>('/admin/warehouses', {
      params: params as Record<string, string | number | boolean | undefined>,
    });

    return {
      data: response.items,
      pagination: {
        page: response.page,
        limit: response.limit,
        total: response.total,
        totalPages: response.totalPages,
      },
    };
  },

  /**
   * 获取仓库层级树
   */
  getTree: async (): Promise<Warehouse[]> => {
    return http.get<Warehouse[]>('/admin/warehouses/tree');
  },

  /**
   * 获取可调货源仓库
   */
  getTransferSources: async (warehouseId: string): Promise<Warehouse[]> => {
    return http.get<Warehouse[]>(`/admin/warehouses/${warehouseId}/transfer-sources`);
  },
};

// ============ 调货单 API ============

/** 调货单筛选参数 */
export interface TransferOrderFilterParams extends BaseFilterParams {
  sourceWarehouseId?: string;
  targetWarehouseId?: string;
  status?: string;
  priority?: TransferPriority;
  dateFrom?: string;
  dateTo?: string;
}

export const transferOrderApi = {
  /**
   * 获取调货单列表
   */
  list: async (params?: TransferOrderFilterParams): Promise<TransferOrder[]> => {
    return http.get<TransferOrder[]>('/admin/transfer-orders', {
      params: params as Record<string, string | number | boolean | undefined>,
    });
  },

  /**
   * 获取调货单列表（带分页）
   */
  listPaginated: async (
    params?: TransferOrderFilterParams
  ): Promise<PaginatedResponse<TransferOrder>> => {
    const response = await http.get<{
      data: TransferOrder[];
      pagination: { page: number; limit: number; total: number; totalPages: number };
    }>('/admin/transfer-orders', {
      params: params as Record<string, string | number | boolean | undefined>,
    });

    return {
      data: response.data,
      pagination: response.pagination,
    };
  },

  /**
   * 获取调货单详情
   */
  get: async (id: string): Promise<TransferOrder> => {
    return http.get<TransferOrder>(`/admin/transfer-orders/${id}`);
  },

  /**
   * 创建调货单
   */
  create: async (data: CreateTransferOrderRequest): Promise<TransferOrder> => {
    return http.post<TransferOrder>('/admin/transfer-orders', data);
  },

  /**
   * 提交审批
   */
  submit: async (id: string): Promise<TransferOrder> => {
    return http.post<TransferOrder>(`/admin/transfer-orders/${id}/submit`);
  },

  /**
   * 审批通过
   */
  approve: async (id: string): Promise<TransferOrder> => {
    return http.post<TransferOrder>(`/admin/transfer-orders/${id}/approve`);
  },

  /**
   * 发货
   */
  ship: async (id: string): Promise<TransferOrder> => {
    return http.post<TransferOrder>(`/admin/transfer-orders/${id}/ship`);
  },

  /**
   * 收货确认
   */
  receive: async (id: string, data: ReceiveTransferOrderRequest): Promise<TransferOrder> => {
    return http.post<TransferOrder>(`/admin/transfer-orders/${id}/receive`, data);
  },
};
