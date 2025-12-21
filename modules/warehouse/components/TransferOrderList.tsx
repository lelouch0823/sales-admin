import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApiQuery } from '../../../hooks/useApiQuery';
import { transferOrderApi } from '../api';
import { TransferOrder, TransferOrderStatus } from '../types';
import { AnimatedBox } from '../../../components/motion';
import { Button } from '../../../components/ui/Button';
import { Plus, ArrowRight } from 'lucide-react';
import { formatDate } from '../../../utils/date';

interface TransferOrderListProps {
  warehouseId?: string;
  onCreate: () => void;
  onView: (order: TransferOrder) => void;
}

export function TransferOrderList({ warehouseId, onCreate, onView }: TransferOrderListProps) {
  const { t } = useTranslation();
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { data: transferOrders, isLoading } = useApiQuery<TransferOrder[]>({
    queryKey: ['transfer-orders', warehouseId, statusFilter],
    queryFn: () =>
      transferOrderApi.list({
        sourceWarehouseId: warehouseId,
        // If viewing specific warehouse, show orders FROM or TO it?
        // For simplicity, let's assume this list shows orders originating from the selected warehouse
        // In a real app, you might want a toggle "Inbound / Outbound"
        status: statusFilter !== 'all' ? statusFilter : undefined,
      }),
    enabled: !!warehouseId,
  });

  const getStatusBadge = (status: TransferOrderStatus) => {
    const colors: Record<TransferOrderStatus, string> = {
      draft: 'bg-gray-100 text-gray-800',
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      received: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return (
      <span
        className={`px-2 py-0.5 rounded-full text-xs font-semibold ${colors[status] || 'bg-gray-100'}`}
      >
        {t(`status.${status}`)}
      </span>
    );
  };

  if (!warehouseId) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 bg-gray-50 h-full rounded-lg border-2 border-dashed mx-6 my-6">
        {t('warehouse.select_to_view_transfers')}
      </div>
    );
  }

  return (
    <AnimatedBox className="flex-1 flex flex-col bg-white overflow-hidden">
      {/* Toolbar */}
      <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white">
        <h2 className="text-lg font-bold text-gray-900">{t('warehouse.transfer_orders')}</h2>
        <div className="flex gap-2">
          <select
            className="text-sm border-gray-200 rounded-md focus:ring-blue-500 focus:border-blue-500"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="all">{t('common.all_status')}</option>
            <option value="pending">{t('status.pending')}</option>
            <option value="approved">{t('status.approved')}</option>
            <option value="shipped">{t('status.shipped')}</option>
          </select>
          <Button size="sm" onClick={onCreate}>
            <Plus size={16} className="mr-1" />
            {t('warehouse.new_transfer')}
          </Button>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <div className="p-8 text-center text-gray-400">Loading transfers...</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('orderNumber')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('route')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('items')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('status')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('date')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {transferOrders?.map(order => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => onView(order)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.orderNumber || order.id.substr(0, 8)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <span>{order.sourceWarehouse.name}</span>
                      <ArrowRight size={14} className="text-gray-400" />
                      <span>{order.targetWarehouse.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {order.items.length} {t('common.items')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(order.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(order.createdAt || '')}
                  </td>
                </tr>
              ))}
              {(!transferOrders || transferOrders.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    {t('noData')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </AnimatedBox>
  );
}
