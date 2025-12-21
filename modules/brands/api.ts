/**
 * 品牌管理 API
 *
 * 对接后端 /brands 接口
 */

import { Brand, BrandStats, BatchDeleteRequest, BatchOperationResult } from './types';
import { http } from '../../lib/http';
import { createCrudApi, BaseFilterParams } from '../../lib/api-factory';

// ============ 类型定义 ============

/** 品牌筛选参数 */
export interface BrandFilterParams extends BaseFilterParams {
  country?: string;
  isActive?: boolean;
}

// ============ API 实例 ============

// 使用工厂创建基础 CRUD API
const baseApi = createCrudApi<Brand, Partial<Brand>, Partial<Brand>, BrandFilterParams>('/brands');

// 扩展品牌特有方法
export const brandApi = {
  ...baseApi,

  /**
   * 获取品牌统计
   */
  getStats: async (): Promise<BrandStats> => {
    return http.get<BrandStats>('/brands/stats');
  },

  /**
   * 批量删除品牌
   */
  batchDelete: async (data: BatchDeleteRequest): Promise<BatchOperationResult> => {
    return http.delete<BatchOperationResult>('/brands/batch', { data });
  },
};
