import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useApiQuery } from '../../../hooks/useApiQuery';
import { transferOrderApi } from '../api';
import { TransferOrder, TransferOrderStatus } from '../types';
import { AnimatedBox } from '../../../components/motion';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { DataTable, Column } from '../../../components/common/DataTable';
import { Badge } from '../../../components/common/Badge';
import { Plus, ArrowRight } from 'lucide-react';
import { formatDate } from '../../../utils/date';

interface TransferOrderListProps {
  warehouseId?: string;
  onCreate: () => void;
  onView: (order: TransferOrder) => void;
}

/**
 * 调货单列表组件
 *
 * 优化点：
 * - 使用 DataTable 自动骨架屏和空状态
 * - 使用 Badge 显示状态
 * - 使用 Select 组件替代原生 select
 */
export function TransferOrderList({ warehouseId, onCreate, onView }: TransferOrderListProps) {
  const { t } = useTranslation();
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { data: transferOrders, isLoading } = useApiQuery<TransferOrder[]>({
    queryKey: ['transfer-orders', warehouseId, statusFilter],
    queryFn: () =>
      transferOrderApi.list({
        sourceWarehouseId: warehouseId,
        status: statusFilter !== 'all' ? statusFilter : undefined,
      }),
    enabled: !!warehouseId,
  });

  // 状态颜色映射
  const getStatusVariant = (
    status: TransferOrderStatus
  ): 'success' | 'warning' | 'danger' | 'neutral' | 'default' => {
    const variants: Record<
      TransferOrderStatus,
      'success' | 'warning' | 'danger' | 'neutral' | 'default'
    > = {
      draft: 'neutral',
      pending: 'warning',
      approved: 'default',
      shipped: 'default',
      received: 'success',
      cancelled: 'danger',
    };
    return variants[status] || 'neutral';
  };

  // 状态筛选选项
  const statusOptions = useMemo(
    () => [
      { value: 'all', label: t('common.all_status') },
      { value: 'pending', label: t('status.pending') },
      { value: 'approved', label: t('status.approved') },
      { value: 'shipped', label: t('status.shipped') },
    ],
    [t]
  );

  // 表格列定义
  const columns: Column<TransferOrder>[] = useMemo(
    () => [
      {
        key: 'orderNumber',
        header: t('orderNumber'),
        sortable: true,
        render: (_, order) => (
          <span className="font-medium text-gray-900">
            {order.orderNumber || order.id.substr(0, 8)}
          </span>
        ),
      },
      {
        key: 'route',
        header: t('route'),
        render: (_, order) => (
          <div className="flex items-center gap-2 text-gray-600">
            <span>{order.sourceWarehouse.name}</span>
            <ArrowRight size={14} className="text-gray-400" />
            <span>{order.targetWarehouse.name}</span>
          </div>
        ),
      },
      {
        key: 'items',
        header: t('items'),
        align: 'center',
        render: (_, order) => (
          <span className="text-gray-600">
            {order.items.length} {t('common.items')}
          </span>
        ),
      },
      {
        key: 'status',
        header: t('status'),
        render: (_, order) => (
          <Badge variant={getStatusVariant(order.status)}>{t(`status.${order.status}`)}</Badge>
        ),
      },
      {
        key: 'createdAt',
        header: t('date'),
        sortable: true,
        render: (_, order) => (
          <span className="text-gray-500">{formatDate(order.createdAt || '')}</span>
        ),
      },
    ],
    [t]
  );

  // 未选择仓库时的占位
  if (!warehouseId) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 bg-gray-50 h-full rounded-lg border-2 border-dashed mx-6 my-6">
        {t('warehouse.select_to_view_transfers')}
      </div>
    );
  }

  return (
    <AnimatedBox className="flex-1 flex flex-col bg-white overflow-hidden rounded-lg border border-gray-100">
      {/* 工具栏 */}
      <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white">
        <h2 className="text-lg font-bold text-gray-900">{t('warehouse.transfer_orders')}</h2>
        <div className="flex gap-2 items-center">
          <Select
            options={statusOptions}
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            fullWidth={false}
            className="w-40"
          />
          <Button size="sm" onClick={onCreate}>
            <Plus size={16} className="mr-1" />
            {t('warehouse.new_transfer')}
          </Button>
        </div>
      </div>

      {/* 数据表格 */}
      <div className="flex-1 overflow-auto">
        <DataTable
          columns={columns}
          data={transferOrders || []}
          rowKey="id"
          loading={isLoading}
          emptyText={t('noData')}
          onRowClick={onView}
        />
      </div>
    </AnimatedBox>
  );
}
