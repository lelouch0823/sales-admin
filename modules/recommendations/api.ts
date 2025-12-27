/**
 * 推荐系统 API
 *
 * 对接后端 /recommendations 接口
 */

import { Recommendation } from './types';
import { createCrudApi, BaseFilterParams } from '../../lib/api-factory';
import { API_ENDPOINTS } from '../../constants/api';

// ============ 类型定义 ============

/** 推荐筛选参数 */
export interface RecommendationFilterParams extends BaseFilterParams {
  tenantId?: string;
  productId?: string;
  isEnabled?: boolean;
  startFrom?: string;
  endTo?: string;
}

// ============ API 实例 ============

// 使用工厂创建 CRUD API
export const recsApi = createCrudApi<
  Recommendation,
  Partial<Recommendation>,
  Partial<Recommendation>,
  RecommendationFilterParams
>(API_ENDPOINTS.RECOMMENDATIONS.LIST, 'recommendations');
