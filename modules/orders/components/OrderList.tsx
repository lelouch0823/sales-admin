import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Order } from '../types';
import { OrderStatusBadge } from './OrderStatusBadge';
import { Badge } from '../../../components/common/Badge';
import { DataTable, Column } from '../../../components/common/DataTable';
import { Tooltip } from '../../../components/primitives';
import { formatCurrency } from '../../../utils/format';
import { formatDate } from '../../../utils/date';
import { Eye } from 'lucide-react';

interface OrderListProps {
  orders: Order[];
  onView: (id: string) => void;
  isLoading: boolean;
}

/**
 * 订单列表组件
 *
 * 优化点：
 * - 使用 DataTable 自动骨架屏加载
 * - 使用 Badge 显示支付状态
 * - 使用 Tooltip 提供操作提示
 */
export function OrderList({ orders, onView, isLoading }: OrderListProps) {
  const { t } = useTranslation();

  // 表格列定义
  const columns: Column<Order>[] = useMemo(
    () => [
      {
        key: 'orderNumber',
        header: t('orderNumber'),
        sortable: true,
        render: (_, order) => (
          <span className="font-medium text-gray-900">{order.orderNumber}</span>
        ),
      },
      {
        key: 'customerName',
        header: t('customer'),
        render: (_, order) => order.customerName,
      },
      {
        key: 'totalAmount',
        header: t('totalAmount'),
        sortable: true,
        align: 'right',
        render: (_, order) => (
          <span className="font-medium">{formatCurrency(order.totalAmount)}</span>
        ),
      },
      {
        key: 'status',
        header: t('status'),
        render: (_, order) => <OrderStatusBadge status={order.status} />,
      },
      {
        key: 'paymentStatus',
        header: t('paymentStatus'),
        render: (_, order) => {
          if (!order.paymentStatus) return '-';
          return (
            <Badge variant={order.paymentStatus === 'paid' ? 'success' : 'neutral'}>
              {t(`paymentStatus.${order.paymentStatus}`)}
            </Badge>
          );
        },
      },
      {
        key: 'createdAt',
        header: t('createdAt'),
        sortable: true,
        render: (_, order) => <span className="text-gray-500">{formatDate(order.createdAt)}</span>,
      },
      {
        key: 'actions',
        header: t('actions'),
        align: 'right',
        render: (_, order) => (
          <div className="flex justify-end" onClick={e => e.stopPropagation()}>
            <Tooltip content={t('viewDetails')}>
              <button
                onClick={() => onView(order.id)}
                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
              >
                <Eye size={16} />
              </button>
            </Tooltip>
          </div>
        ),
      },
    ],
    [t, onView]
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <DataTable
        columns={columns}
        data={orders}
        rowKey="id"
        loading={isLoading}
        emptyText={t('noOrdersFound')}
        onRowClick={order => onView(order.id)}
      />
    </div>
  );
}
