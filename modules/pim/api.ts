/**
 * 产品管理 API
 *
 * 对接后端 /products 接口
 */

import { Product } from './types';
import { http } from '../../lib/http';
import { createApiWithStats, BaseFilterParams } from '../../lib/api-factory';
import { API_ENDPOINTS } from '../../constants/api';

// ============ 类型定义 ============

/** 产品筛选参数 */
export interface ProductFilterParams extends BaseFilterParams {
  categoryId?: string;
  brandId?: string;
  designerId?: string;
  collectionId?: string;
  stockStatus?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  minPrice?: number;
  maxPrice?: number;
  tags?: string[];
  material?: string;
  color?: string;
}

/** 产品统计 */
export interface ProductStats {
  totalProducts: number;
  activeProducts: number;
  inactiveProducts: number;
  lowStockProducts: number;
}

/** 批量状态更新请求 */
export interface BatchStatusRequest {
  productIds: string[];
  status: string;
}

// ============ API 实例 ============

// 使用工厂创建基础 CRUD API
const baseApi = createApiWithStats<
  Product,
  ProductStats,
  Partial<Product>,
  Partial<Product>,
  ProductFilterParams
>(API_ENDPOINTS.PRODUCTS.LIST, 'products');

// 扩展自定义方法
export const productApi = {
  ...baseApi,

  /**
   * 批量更新产品状态
   */
  batchUpdateStatus: async (data: BatchStatusRequest): Promise<void> => {
    await http.patch('/products/batch-status', data);
  },

  /**
   * 获取产品推荐
   */
  getRecommendations: async (productId: string, limit = 5): Promise<Product[]> => {
    return http.get<Product[]>(`/products/${productId}/recommendations`, {
      params: { limit },
    });
  },
};
