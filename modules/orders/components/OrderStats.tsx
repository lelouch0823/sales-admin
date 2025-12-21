import { useTranslation } from 'react-i18next';
import { OrderStats } from '../types';
import { DollarSign, ShoppingBag, Package, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../../../utils/format';

interface OrderStatsProps {
  stats?: OrderStats;
  isLoading: boolean;
}

export function OrderStatsCards({ stats, isLoading }: OrderStatsProps) {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const cards = [
    {
      title: t('totalOrders'),
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: 'bg-blue-500',
    },
    {
      title: t('totalRevenue'),
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      color: 'bg-green-500',
    },
    {
      title: t('pendingOrders'),
      value: stats.byStatus.pending || 0,
      icon: AlertCircle,
      color: 'bg-yellow-500',
    },
    {
      title: t('processingOrders'),
      value: stats.byStatus.processing || 0,
      icon: Package,
      color: 'bg-indigo-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center"
        >
          <div className={`${card.color} p-3 rounded-full text-white mr-4`}>
            <card.icon size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm">{card.title}</p>
            <p className="text-2xl font-semibold">{card.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
