import React from 'react';
import { useApp } from '../lib/context';
import { QuickActions } from '../components/dashboard/QuickActions';
import { ActivityFeed } from '../components/dashboard/ActivityFeed';
import { WelcomeBanner } from '../components/dashboard/WelcomeBanner';
import { StatsGrid } from '../components/dashboard/StatsGrid';
import { TrendCharts } from '../components/dashboard/TrendCharts';
import { AnimatedBox } from '../components/motion';
import { TooltipProvider } from '../components/primitives';

/**
 * 仪表盘视图 (DashboardView)
 * 
 * 使用封装:
 * - AnimatedBox: Framer Motion 动画组件
 * - TrendCharts: Recharts 图表组件
 * - TooltipProvider: Radix UI Tooltip
 */
export const DashboardView: React.FC = () => {
  const { customers, recommendations, logs, products, currentUser } = useApp();

  const totalCustomers = customers.length;
  const activeRecs = recommendations.filter(r => r.isEnabled).length;
  const todayLogs = logs.length;

  return (
    <TooltipProvider>
      <div className="space-y-8">
        {/* 欢迎横幅 */}
        <AnimatedBox animation="fadeInDown" delay={0}>
          <WelcomeBanner />
        </AnimatedBox>

        {/* 核心指标网格 */}
        <AnimatedBox animation="fadeInUp" delay={0.1}>
          <StatsGrid
            customerCount={totalCustomers}
            activeRecsCount={activeRecs}
            productCount={products.length}
            logCount={todayLogs}
          />
        </AnimatedBox>

        {/* 趋势图表 */}
        <AnimatedBox animation="fadeIn" delay={0.2}>
          <TrendCharts />
        </AnimatedBox>

        {/* 两列布局 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <AnimatedBox animation="fadeInLeft" delay={0.3} className="lg:col-span-2 space-y-8">
            <QuickActions currentUserRole={currentUser.role} />
          </AnimatedBox>
          <AnimatedBox animation="fadeInRight" delay={0.4} className="lg:col-span-1">
            <ActivityFeed logs={logs} />
          </AnimatedBox>
        </div>
      </div>
    </TooltipProvider>
  );
};