/**
 * 数据分析类型定义
 *
 * 对应后端 /analytics 接口
 */

// ============ 枚举类型 ============

/** 时间范围 */
export type TimeRange =
  | 'TODAY'
  | 'YESTERDAY'
  | 'LAST_7_DAYS'
  | 'LAST_30_DAYS'
  | 'LAST_90_DAYS'
  | 'THIS_MONTH'
  | 'LAST_MONTH'
  | 'THIS_YEAR'
  | 'LAST_YEAR'
  | 'CUSTOM';

// ============ 实体类型 ============

/** 仪表板概览 */
export interface DashboardOverview {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  revenueGrowth: number;
  orderGrowth: number;
  customerGrowth: number;
  conversionRate: number;
  averageOrderValue: number;
  customerLifetimeValue: number;
}

/** 仪表板数据 */
export interface DashboardData {
  overview: DashboardOverview;
  recentOrders: unknown[];
  topProducts: unknown[];
  alerts: unknown[];
  charts: {
    salesTrend: unknown[];
    userGrowth: unknown[];
    topCategories: unknown[];
    revenueByChannel: unknown[];
    inventoryStatus: Record<string, unknown>;
    customerSegments: unknown[];
  };
}

/** 综合分析报告 */
export interface ComprehensiveReport {
  sales: Record<string, unknown>;
  users: Record<string, unknown>;
  products: Record<string, unknown>;
  summary: {
    totalRevenue: number;
    totalOrders: number;
    totalCustomers: number;
    totalProducts: number;
    averageOrderValue: number;
    customerRetentionRate: number;
    conversionRate: number;
    topSellingProduct: string;
  };
  insights: string[];
  generatedAt: string;
}

/** 趋势分析 */
export interface TrendsData {
  salesTrend: unknown[];
  userGrowthTrend: unknown[];
  productPerformanceTrend: unknown[];
  seasonalPatterns: {
    hasSeasonality: boolean;
    pattern: string;
    averageRevenue: number;
    recentAverageRevenue: number;
  };
  predictions: {
    available: boolean;
    nextDayRevenue: number;
    nextDayOrders: number;
    confidence: number;
    method: string;
  };
  analysisDate: string;
}

/** 实时数据 */
export interface RealtimeData {
  onlineUsers: number;
  todayRevenue: number;
  todayOrders: number;
  todayNewUsers: number;
  averageOrderValue: number;
  conversionRate: number;
  recentActivities: unknown[];
  liveOrders: unknown[];
  lastUpdated: string;
}

/** 关键指标 */
export interface Metrics {
  revenue: {
    total: number;
    growth: number;
    target: number;
    achievement: number;
  };
  orders: {
    total: number;
    growth: number;
    averageValue: number;
    conversionRate: number;
  };
  customers: {
    total: number;
    new: number;
    returning: number;
    retentionRate: number;
  };
  products: {
    total: number;
    active: number;
    topPerformer: Record<string, unknown>;
    lowPerformer: Record<string, unknown>;
  };
  generatedAt: string;
}

/** 对比分析 */
export interface ComparisonData {
  current: {
    sales: Record<string, unknown>;
    users: Record<string, unknown>;
    products: Record<string, unknown>;
    summary: Record<string, unknown>;
  };
  comparison: {
    sales: Record<string, unknown>;
    users: Record<string, unknown>;
    products: Record<string, unknown>;
    summary: Record<string, unknown>;
  };
  changes: {
    revenue: number;
    orders: number;
    customers: number;
    averageOrderValue: number;
  };
  insights: string[];
  period: {
    current: TimeRange;
    comparison: TimeRange;
  };
  generatedAt: string;
}

/** 销售报表 */
export interface SalesReport {
  summary: { totalSales: number };
  salesData: unknown[];
  topPerformers: Record<string, unknown>;
}
