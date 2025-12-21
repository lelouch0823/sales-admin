import { useTranslation } from 'react-i18next';
import { SimplePieChart, ChartDataPoint } from '../../../components/charts';

interface CategoryDistributionProps {
  data?: ChartDataPoint[];
  isLoading: boolean;
}

export function CategoryDistribution({ data, isLoading }: CategoryDistributionProps) {
  const { t } = useTranslation();

  if (isLoading) {
    return <div className="h-[300px] bg-gray-50 rounded-lg animate-pulse" />;
  }

  const chartData = data || [];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900">{t('categoryDistribution')}</h3>
      </div>

      <div className="h-[300px]">
        {chartData.length > 0 ? (
          <SimplePieChart data={chartData} height={300} innerRadius={60} outerRadius={100} />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">{t('noData')}</div>
        )}
      </div>
    </div>
  );
}
