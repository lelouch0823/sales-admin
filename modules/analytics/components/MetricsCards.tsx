import React from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatedList, AnimatedListItem } from '../../components/motion';
import { DashboardOverview } from '../../modules/analytics/types';
import { DollarSign, ShoppingBag, Users, Package, TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency, formatNumber } from '../../utils/format';

interface MetricsCardsProps {
  overview?: DashboardOverview;
  isLoading: boolean;
}

export function MetricsCards({ overview, isLoading }: MetricsCardsProps) {
  const { t } = useTranslation();

  if (isLoading || !overview) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div
            key={i}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-32 animate-pulse"
          />
        ))}
      </div>
    );
  }

  const cards = [
    {
      label: t('totalRevenue'),
      value: formatCurrency(overview.totalRevenue),
      subValue: overview.revenueGrowth,
      icon: DollarSign,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: t('totalOrders'),
      value: formatNumber(overview.totalOrders),
      subValue: overview.orderGrowth,
      icon: ShoppingBag,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      label: t('totalCustomers'),
      value: formatNumber(overview.totalCustomers),
      subValue: overview.customerGrowth,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: t('avgOrderValue'),
      value: formatCurrency(overview.averageOrderValue),
      subValue: overview.conversionRate, // Just using a diff metric for display
      isRate: true,
      icon: Package,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <AnimatedList className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <AnimatedListItem key={index}>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-lg ${card.bgColor} ${card.color}`}>
                <card.icon size={20} />
              </div>
              {card.subValue !== 0 && (
                <div
                  className={`flex items-center text-xs font-medium ${card.subValue > 0 ? 'text-green-600' : 'text-red-600'}`}
                >
                  {card.subValue > 0 ? (
                    <TrendingUp size={14} className="mr-1" />
                  ) : (
                    <TrendingDown size={14} className="mr-1" />
                  )}
                  {Math.abs(card.subValue)}%
                </div>
              )}
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">{card.label}</p>
              <h3 className="text-2xl font-bold text-gray-900">{card.value}</h3>
            </div>
          </div>
        </AnimatedListItem>
      ))}
    </AnimatedList>
  );
}
