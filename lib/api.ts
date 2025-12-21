/**
 * API 服务统一导出
 *
 * 提供所有 API 服务的统一入口
 */

// HTTP 客户端与工具
export { http, HttpError, tokenManager } from './http';
export type { ApiResponse, RequestConfig } from './http';

// API 工厂
export { createCrudApi, createApiWithStats } from './api-factory';
export type { CrudApi, PaginationParams, PaginatedResponse, BaseFilterParams } from './api-factory';

// 认证服务
export { authApi } from './services/auth';
export type { LoginRequest, LoginResponse, ChangePasswordRequest } from './services/auth';

// 用户服务
export { userApi } from './services/user';
export type { UserFilterParams, UserStats, CreateUserDto, UpdateUserDto } from './services/user';

// 系统服务
export * from './services/system';

// 模块 API
export { productApi } from '../modules/pim/api';
export type { ProductFilterParams, ProductStats, BatchStatusRequest } from '../modules/pim/api';

export { inventoryApi } from '../modules/inventory/api';
export type {
  InventoryFilterParams,
  InventoryStats,
  AdjustInventoryRequest,
  TransferInventoryRequest,
  ReserveInventoryRequest,
} from '../modules/inventory/api';

export { crmApi } from '../modules/crm/api';
export type { CustomerFilterParams } from '../modules/crm/api';

export { recsApi } from '../modules/recommendations/api';

// 新增模块 API
export { orderApi } from '../modules/orders/api';
export type { OrderFilterParams, UpdateOrderStatusRequest } from '../modules/orders/api';

export { analyticsApi } from '../modules/analytics/api';
export type { DashboardParams, ComparisonParams, SalesParams } from '../modules/analytics/api';

export { brandApi } from '../modules/brands/api';
export type { BrandFilterParams } from '../modules/brands/api';

export { collectionApi } from '../modules/collections/api';
export type { CollectionFilterParams } from '../modules/collections/api';

export { designerApi } from '../modules/designers/api';
export type { DesignerFilterParams } from '../modules/designers/api';

export { warehouseApi, transferOrderApi } from '../modules/warehouse/api';
export type {
  WarehouseFilterParams,
  CreateTransferOrderRequest,
  ReceiveTransferOrderRequest,
} from '../modules/warehouse/api';
