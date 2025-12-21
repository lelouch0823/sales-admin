import { useTranslation } from 'react-i18next';
import { Order } from '../types';
import { OrderStatusBadge } from './OrderStatusBadge';
import { formatCurrency } from '../../../utils/format';
import { formatDate } from '../../../utils/date';
import { Eye } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface OrderListProps {
  orders: Order[];
  onView: (id: string) => void;
  isLoading: boolean;
}

export function OrderList({ orders, onView, isLoading }: OrderListProps) {
  const { t } = useTranslation();

  if (isLoading) {
    return <div className="p-4 text-center text-gray-500">Loading orders...</div>;
  }

  if (orders.length === 0) {
    return <div className="p-4 text-center text-gray-500">{t('noOrdersFound')}</div>;
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-100">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-100">
          <tr>
            <th className="px-4 py-3">{t('orderNumber')}</th>
            <th className="px-4 py-3">{t('customer')}</th>
            <th className="px-4 py-3">{t('totalAmount')}</th>
            <th className="px-4 py-3">{t('status')}</th>
            <th className="px-4 py-3">{t('paymentStatus')}</th>
            <th className="px-4 py-3">{t('createdAt')}</th>
            <th className="px-4 py-3 text-right">{t('actions')}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {orders.map(order => (
            <tr key={order.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 font-medium text-gray-900">{order.orderNumber}</td>
              <td className="px-4 py-3">{order.customerName}</td>
              <td className="px-4 py-3">{formatCurrency(order.totalAmount)}</td>
              <td className="px-4 py-3">
                <OrderStatusBadge status={order.status} />
              </td>
              <td className="px-4 py-3">
                <span
                  className={`capitalize ${order.paymentStatus === 'paid' ? 'text-green-600' : 'text-gray-500'}`}
                >
                  {order.paymentStatus ? t(`paymentStatus.${order.paymentStatus}`) : '-'}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-500">{formatDate(order.createdAt)}</td>
              <td className="px-4 py-3 text-right space-x-2">
                <Button variant="ghost" size="sm" onClick={() => onView(order.id)}>
                  <Eye size={16} className="text-gray-500 hover:text-blue-600" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
