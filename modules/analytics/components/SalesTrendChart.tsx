import { useTranslation } from 'react-i18next';

import { SimpleAreaChart, chartColors, ChartDataPoint } from '../../../components/charts';

interface SalesTrendChartProps {
  data?: ChartDataPoint[];
  isLoading: boolean;
}

export function SalesTrendChart({ data, isLoading }: SalesTrendChartProps) {
  const { t } = useTranslation();

  if (isLoading) {
    return <div className="h-[300px] bg-gray-50 rounded-lg animate-pulse" />;
  }

  // Fallback if no data provided
  const chartData = data || [];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900">{t('salesTrend')}</h3>
        <p className="text-sm text-gray-500">{t('salesTrendDesc')}</p>
      </div>

      <div className="h-[300px]">
        {chartData.length > 0 ? (
          <SimpleAreaChart
            data={chartData}
            dataKey="value"
            color={chartColors.brand}
            height={300}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">{t('noData')}</div>
        )}
      </div>
    </div>
  );
}
