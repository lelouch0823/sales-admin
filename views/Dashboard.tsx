import React from 'react';
import { useApp } from '../lib/context';
import { QuickActions } from '../components/dashboard/QuickActions';
import { ActivityFeed } from '../components/dashboard/ActivityFeed';
import { WelcomeBanner } from '../components/dashboard/WelcomeBanner';
import { StatsGrid } from '../components/dashboard/StatsGrid';

/**
 * 仪表盘视图 (DashboardView)
 * 职责:
 * 1. 作为应用首页，提供全局状态概览
 * 2. 展示欢迎语 (WelcomeBanner)
 * 3. 展示关键指标 (StatsGrid: 客户数、推荐数、商品数、日志数)
 * 4. 提供常用功能的快捷入口 (QuickActions)
 * 5. 展示最近的系统活动日志 (ActivityFeed)
 */
export const DashboardView: React.FC = () => {
  const { customers, recommendations, logs, products, currentUser } = useApp();

  // 简单的数据聚合计算
  const totalCustomers = customers.length;
  const activeRecs = recommendations.filter(r => r.isEnabled).length; // 仅统计生效的推荐
  const todayLogs = logs.length; // (Mock: 实际应过滤今日日期)

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 欢迎横幅: 显示当前用户角色和上下文 */}
      <WelcomeBanner />

      {/* 核心指标网格 */}
      <StatsGrid 
        customerCount={totalCustomers}
        activeRecsCount={activeRecs}
        productCount={products.length}
        logCount={todayLogs}
      />

      {/* 两列布局: 左侧操作区，右侧活动流 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            {/* 根据角色动态显示的快捷按钮 */}
            <QuickActions currentUserRole={currentUser.role} />
        </div>
        <div className="lg:col-span-1">
            {/* 审计日志预览 */}
            <ActivityFeed logs={logs} />
        </div>
      </div>
    </div>
  );
};