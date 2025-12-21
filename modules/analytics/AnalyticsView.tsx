import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatedBox } from '../../components/motion';
import { useApiQuery } from '../../hooks/useApiQuery';
import { analyticsApi } from './api';
import { DashboardData, TimeRange } from './types';
import { MetricsCards } from './components/MetricsCards';
import { SalesTrendChart } from './components/SalesTrendChart';
import { CategoryDistribution } from './components/CategoryDistribution';
import { ChartDataPoint } from '../../components/charts';

import { Calendar } from 'lucide-react';

export function AnalyticsView() {
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = useState<TimeRange>('LAST_30_DAYS');

  const { data, isLoading } = useApiQuery<DashboardData>({
    queryKey: ['analytics-dashboard', timeRange],
    queryFn: () => analyticsApi.getDashboard({ timeRange }),
  });

  const timeRanges: { label: string; value: TimeRange }[] = [
    { label: t('last7Days'), value: 'LAST_7_DAYS' },
    { label: t('last30Days'), value: 'LAST_30_DAYS' },
    { label: t('thisMonth'), value: 'THIS_MONTH' },
    { label: t('lastYear'), value: 'LAST_YEAR' },
  ];

  return (
    <AnimatedBox className="h-full flex flex-col p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('analytics')}</h1>
          <p className="text-gray-500 text-sm mt-1">{t('analyticsSubtitle')}</p>
        </div>

        <div className="flex bg-white rounded-lg border border-gray-200 p-1 shadow-sm">
          {timeRanges.map(range => (
            <button
              key={range.value}
              onClick={() => setTimeRange(range.value)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                timeRange === range.value
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {range.label}
            </button>
          ))}
          <div className="w-px bg-gray-200 mx-1 my-1"></div>
          <button className="px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 flex items-center">
            <Calendar size={14} className="mr-2" />
            {t('custom')}
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <MetricsCards overview={data?.overview} isLoading={isLoading} />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesTrendChart
            data={data?.charts.salesTrend as unknown as ChartDataPoint[]}
            isLoading={isLoading}
          />
        </div>
        <div>
          <CategoryDistribution
            data={data?.charts.topCategories as unknown as ChartDataPoint[]}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Additional Sections (Placeholder for future expansion) */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SimpleBarChart ... />
          <SimpleLineChart ... />
      </div> */}
    </AnimatedBox>
  );
}
