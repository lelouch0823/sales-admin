/**
 * 设计师管理 API
 *
 * 对接后端 /designers 接口
 */

import { Designer, DesignerStats, DesignerLevel, PortfolioItem } from './types';
import { http } from '../../lib/http';
import { createApiWithStats, BaseFilterParams } from '../../lib/api-factory';

// ============ 类型定义 ============

/** 设计师筛选参数 */
export interface DesignerFilterParams extends BaseFilterParams {
  level?: DesignerLevel;
}

// ============ API 实例 ============

// 使用工厂创建基础 API
const baseApi = createApiWithStats<
  Designer,
  DesignerStats,
  Partial<Designer>,
  Partial<Designer>,
  DesignerFilterParams
>('/designers', 'designers');

// 扩展设计师特有方法
export const designerApi = {
  ...baseApi,

  /**
   * 获取活跃设计师
   */
  getActive: async (): Promise<Designer[]> => {
    return http.get<Designer[]>('/designers/active');
  },

  /**
   * 获取设计师作品集
   */
  getPortfolio: async (id: string): Promise<PortfolioItem[]> => {
    return http.get<PortfolioItem[]>(`/designers/${id}/portfolio`);
  },
};
