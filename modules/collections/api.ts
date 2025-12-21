/**
 * 系列管理 API
 *
 * 对接后端 /collections 接口
 */

import { Collection, CollectionStats, CollectionStatus } from './types';
import { http } from '../../lib/http';
import { createApiWithStats, BaseFilterParams } from '../../lib/api-factory';

// ============ 类型定义 ============

/** 系列筛选参数 */
export interface CollectionFilterParams extends BaseFilterParams {
  brandId?: string;
  designerId?: string;
  status?: CollectionStatus;
}

/** 批量更新状态请求 */
export interface BatchUpdateCollectionStatusRequest {
  collectionIds: string[];
  status: CollectionStatus;
}

/** 批量更新结果 */
export interface BatchUpdateCollectionResult {
  updatedCount: number;
  failedCount: number;
}

// ============ API 实例 ============

// 使用工厂创建基础 API
const baseApi = createApiWithStats<
  Collection,
  CollectionStats,
  Partial<Collection>,
  Partial<Collection>,
  CollectionFilterParams
>('/collections');

// 扩展系列特有方法
export const collectionApi = {
  ...baseApi,

  /**
   * 获取活跃系列
   */
  getActive: async (): Promise<Collection[]> => {
    return http.get<Collection[]>('/collections/active');
  },

  /**
   * 根据品牌获取系列
   */
  getByBrand: async (brandId: string): Promise<Collection[]> => {
    return http.get<Collection[]>(`/collections/by-brand/${brandId}`);
  },

  /**
   * 根据设计师获取系列
   */
  getByDesigner: async (designerId: string): Promise<Collection[]> => {
    return http.get<Collection[]>(`/collections/by-designer/${designerId}`);
  },

  /**
   * 批量更新系列状态
   */
  batchUpdateStatus: async (
    data: BatchUpdateCollectionStatusRequest
  ): Promise<BatchUpdateCollectionResult> => {
    return http.patch<BatchUpdateCollectionResult>('/collections/batch-status', data);
  },
};
