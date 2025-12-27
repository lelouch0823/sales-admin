import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApiQuery } from '../../../hooks/useApiQuery';
import { orderApi } from '../api';
import { Order, OrderItem, OrderLog, OrderStatus } from '../types';
import { AnimatedBox } from '../../../components/motion'; // Import from folder index
import { Button } from '../../../components/ui/Button';
import { OrderItemList } from './OrderItemList';
import { OrderTimeline } from './OrderTimeline';
import { OrderStatusBadge } from './OrderStatusBadge';
import { formatCurrency } from '../../../utils/format';
import { formatDate } from '../../../utils/date';
import { ArrowLeft, Printer, Box, XCircle, CheckCircle, Truck } from 'lucide-react';
import { Skeleton, CardSkeleton } from '../../../components/common/Skeleton';

interface OrderDetailProps {
  id: string;
  onBack: () => void;
}

export function OrderDetail({ id, onBack }: OrderDetailProps) {
  const { t } = useTranslation();
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch Order Details
  const {
    data: order,
    isLoading,
    refetch,
  } = useApiQuery<Order>({
    queryKey: ['order', id],
    queryFn: () => orderApi.get(id),
  });

  // Fetch Items
  const { data: items } = useApiQuery<OrderItem[]>({
    queryKey: ['order-items', id],
    queryFn: () => orderApi.getItems(id),
  });

  // Fetch Logs
  const { data: logs } = useApiQuery<OrderLog[]>({
    queryKey: ['order-logs', id],
    queryFn: () => orderApi.getLogs(id),
  });

  const handleStatusUpdate = async (newStatus: OrderStatus) => {
    if (!order) return;
    setIsUpdating(true);
    try {
      await orderApi.updateStatus(order.id, { status: newStatus });
      refetch(); // Refresh order data
      // Optionally refresh logs too
    } catch (error) {
      console.error('Failed to update status', error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Skeleton variant="circular" width={40} height={40} />
          <div className="flex-1">
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <CardSkeleton />
            <CardSkeleton />
          </div>
          <div className="space-y-6">
            <CardSkeleton />
            <CardSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return <div className="p-8 text-center text-red-500">{t('orders.not_found')}</div>;
  }

  return (
    <AnimatedBox className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-3">
              {order.orderNumber}
              <OrderStatusBadge status={order.status} />
            </h1>
            <p className="text-gray-500 text-sm">
              {t('createdAt')}: {formatDate(order.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">
            <Printer size={16} className="mr-2" /> {t('print')}
          </Button>
          {/* Action Buttons based on status */}
          {order.status === 'pending' && (
            <Button onClick={() => handleStatusUpdate('confirmed')} disabled={isUpdating}>
              <CheckCircle size={16} className="mr-2" /> {t('confirmOrder')}
            </Button>
          )}
          {order.status === 'confirmed' && (
            <Button onClick={() => handleStatusUpdate('processing')} disabled={isUpdating}>
              <Box size={16} className="mr-2" /> {t('processOrder')}
            </Button>
          )}
          {order.status === 'processing' && (
            <Button onClick={() => handleStatusUpdate('shipped')} disabled={isUpdating}>
              <Truck size={16} className="mr-2" /> {t('shipOrder')}
            </Button>
          )}
          {['pending', 'confirmed'].includes(order.status) && (
            <Button
              variant="danger"
              onClick={() => handleStatusUpdate('cancelled')}
              disabled={isUpdating}
            >
              <XCircle size={16} className="mr-2" /> {t('cancelOrder')}
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Items & Payment */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <section className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold mb-4">{t('orderItems')}</h2>
            {items ? <OrderItemList items={items} /> : <Skeleton lines={3} />}

            <div className="mt-6 flex justify-end border-t pt-4">
              <div className="text-right space-y-2">
                <div className="flex justify-between w-48">
                  <span className="text-gray-500">{t('subtotal')}</span>
                  <span>{formatCurrency(order.totalAmount)}</span>
                </div>
                <div className="flex justify-between w-48 font-bold text-lg">
                  <span>{t('total')}</span>
                  <span>{formatCurrency(order.totalAmount)}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Timeline */}
          <section className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold mb-6">{t('orderHistory')}</h2>
            {logs ? <OrderTimeline logs={logs} /> : <Skeleton lines={4} />}
          </section>
        </div>

        {/* Right Column: Customer & Shipping */}
        <div className="space-y-6">
          {/* Customer Info */}
          <section className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold mb-4">{t('customer')}</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                  {order.customerName.charAt(0)}
                </div>
                <div>
                  <p className="font-medium">{order.customerName}</p>
                  <p className="text-sm text-gray-500">ID: {order.customerId}</p>
                </div>
              </div>
              <div className="pt-3 border-t">
                <p className="text-sm text-gray-500 label">{t('notes')}</p>
                <p className="text-sm">{order.notes || '-'}</p>
              </div>
            </div>
          </section>

          {/* Shipping Info */}
          <section className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold mb-4">{t('shippingAddress')}</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              {order.shippingAddress || t('orders.no_shipping_address')}
            </p>
          </section>
        </div>
      </div>
    </AnimatedBox>
  );
}
