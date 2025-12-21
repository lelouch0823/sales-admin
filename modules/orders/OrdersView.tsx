import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatedBox } from '../../components/motion';
import { OrderFilters } from './components/OrderFilters';
import { OrderStatsCards } from './components/OrderStats';
import { OrderList } from './components/OrderList';
import { OrderDetail } from './components/OrderDetail';
import { useApiQuery } from '../../hooks/useApiQuery';
import { orderApi } from './api';
import { Order, OrderFilterParams, OrderStats } from './types';

export function OrdersView() {
  const { t } = useTranslation();
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [filterParams, setFilterParams] = useState<OrderFilterParams>({
    page: 1,
    limit: 10,
  });

  // Fetch Orders
  const { data: ordersData, isLoading: isOrdersLoading } = useApiQuery<Order[]>({
    queryKey: ['orders', filterParams],
    queryFn: () => orderApi.list(filterParams),
  });

  // Fetch Stats
  const { data: statsData, isLoading: isStatsLoading } = useApiQuery<OrderStats>({
    queryKey: ['orders-stats'],
    queryFn: () => orderApi.getStats(),
  });

  const orders = ordersData || [];

  const handleSearchChange = (search: string) => {
    setFilterParams(prev => ({ ...prev, search, page: 1 }));
  };

  const handleStatusChange = (status: string) => {
    setFilterParams(prev => ({
      ...prev,
      status: status === 'all' ? undefined : status,
      page: 1,
    }));
  };

  if (selectedOrderId) {
    return <OrderDetail id={selectedOrderId} onBack={() => setSelectedOrderId(null)} />;
  }

  return (
    <AnimatedBox className="h-full flex flex-col p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">{t('orders')}</h1>
      </div>

      <OrderStatsCards stats={statsData} isLoading={isStatsLoading} />

      <OrderFilters
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
        currentStatus={filterParams.status || 'all'}
      />

      <OrderList orders={orders} isLoading={isOrdersLoading} onView={setSelectedOrderId} />
    </AnimatedBox>
  );
}
