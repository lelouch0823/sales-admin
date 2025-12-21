/**
 * 数据分析 API
 *
 * 对接后端 /analytics 接口
 */

import {
  TimeRange,
  DashboardData,
  ComprehensiveReport,
  TrendsData,
  RealtimeData,
  Metrics,
  ComparisonData,
  SalesReport,
} from './types';
import { http } from '../../lib/http';

// ============ 类型定义 ============

/** 仪表板查询参数 */
export interface DashboardParams {
  timeRange?: TimeRange;
  startDate?: string;
  endDate?: string;
}

/** 对比查询参数 */
export interface ComparisonParams {
  timeRange?: TimeRange;
  compareWith: TimeRange;
}

/** 销售报表查询参数 */
export interface SalesParams {
  period?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  dateFrom?: string;
  dateTo?: string;
  groupBy?: string;
}

// ============ API 实例 ============

export const analyticsApi = {
  /**
   * 获取仪表板数据
   */
  getDashboard: async (params?: DashboardParams): Promise<DashboardData> => {
    return http.get<DashboardData>('/analytics/dashboard', {
      params: params as Record<string, string | number | boolean | undefined>,
    });
  },

  /**
   * 获取综合分析报告
   */
  getComprehensive: async (): Promise<ComprehensiveReport> => {
    return http.get<ComprehensiveReport>('/analytics/comprehensive');
  },

  /**
   * 获取趋势分析
   */
  getTrends: async (): Promise<TrendsData> => {
    return http.get<TrendsData>('/analytics/trends');
  },

  /**
   * 获取实时数据
   */
  getRealtime: async (): Promise<RealtimeData> => {
    return http.get<RealtimeData>('/analytics/realtime');
  },

  /**
   * 获取关键指标
   */
  getMetrics: async (): Promise<Metrics> => {
    return http.get<Metrics>('/analytics/metrics');
  },

  /**
   * 获取对比分析
   */
  getComparison: async (params: ComparisonParams): Promise<ComparisonData> => {
    return http.get<ComparisonData>('/analytics/comparison', {
      params: params as unknown as Record<string, string | number | boolean | undefined>,
    });
  },

  /**
   * 获取销售报表
   */
  getSales: async (params?: SalesParams): Promise<SalesReport> => {
    return http.get<SalesReport>('/analytics/sales', {
      params: params as Record<string, string | number | boolean | undefined>,
    });
  },
};
