/**
 * 库存预订管理组件
 *
 * 管理 SKU 的预订/占用
 * 符合 UI 设计规范
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Package, Plus, Trash2, Calendar, User, Clock, AlertTriangle } from 'lucide-react';

import { Card } from '../../../components/common/Card';
import { Badge } from '../../../components/common/Badge';
import { Button, Input, Select, Textarea } from '../../../components/ui';
import { Modal } from '../../../components/common/Modal';
import { DataTable } from '../../../components/common/DataTable';

import { dateUtils } from '../../../utils';

// ============ 类型定义 ============

/** 预订状态 */
export type ReservationStatus = 'ACTIVE' | 'FULFILLED' | 'CANCELLED' | 'EXPIRED';

/** 预订来源 */
export type ReservationSource = 'MANUAL' | 'ORDER' | 'TRANSFER';

/** 预订记录 */
export interface Reservation {
  id: string;
  sku: string;
  productName: string;
  warehouseId: string;
  warehouseName: string;
  quantity: number;
  status: ReservationStatus;
  source: ReservationSource;
  referenceNo?: string;
  expiresAt?: string;
  remarks?: string;
  createdBy: string;
  createdByName: string;
  createdAt: string;
}

interface ReservationListProps {
  reservations: Reservation[];
  warehouses: { id: string; name: string }[];
  products: { sku: string; name: string }[];
  currentUserId: string;
  currentUserName: string;
  onCreateReservation: (reservation: Omit<Reservation, 'id' | 'createdAt'>) => void;
  onCancelReservation: (id: string) => void;
  onFulfillReservation: (id: string) => void;
}

// 状态配置
const STATUS_CONFIG: Record<
  ReservationStatus,
  { variant: 'success' | 'warning' | 'danger' | 'neutral'; label: string }
> = {
  ACTIVE: { variant: 'warning', label: '预订中' },
  FULFILLED: { variant: 'success', label: '已完成' },
  CANCELLED: { variant: 'neutral', label: '已取消' },
  EXPIRED: { variant: 'danger', label: '已过期' },
};

export const ReservationList: React.FC<ReservationListProps> = ({
  reservations,
  warehouses,
  products,
  currentUserId,
  currentUserName,
  onCreateReservation,
  onCancelReservation,
  onFulfillReservation,
}) => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<ReservationStatus | 'ALL'>('ALL');

  // 新建表单状态
  const [newSku, setNewSku] = useState('');
  const [newWarehouseId, setNewWarehouseId] = useState('');
  const [newQuantity, setNewQuantity] = useState(1);
  const [newExpiresAt, setNewExpiresAt] = useState('');
  const [newRemarks, setNewRemarks] = useState('');

  // 筛选
  const filteredReservations = reservations.filter(
    r => filterStatus === 'ALL' || r.status === filterStatus
  );

  // 重置表单
  const resetForm = () => {
    setNewSku('');
    setNewWarehouseId(warehouses[0]?.id || '');
    setNewQuantity(1);
    setNewExpiresAt('');
    setNewRemarks('');
  };

  // 提交
  const handleSubmit = () => {
    if (!newSku || !newWarehouseId || newQuantity < 1) return;

    const product = products.find(p => p.sku === newSku);
    const warehouse = warehouses.find(w => w.id === newWarehouseId);

    onCreateReservation({
      sku: newSku,
      productName: product?.name || newSku,
      warehouseId: newWarehouseId,
      warehouseName: warehouse?.name || newWarehouseId,
      quantity: newQuantity,
      status: 'ACTIVE',
      source: 'MANUAL',
      expiresAt: newExpiresAt || undefined,
      remarks: newRemarks || undefined,
      createdBy: currentUserId,
      createdByName: currentUserName,
    });

    resetForm();
    setIsModalOpen(false);
  };

  const warehouseOptions = warehouses.map(w => ({ value: w.id, label: w.name }));
  const productOptions = products.map(p => ({ value: p.sku, label: `${p.sku} - ${p.name}` }));

  return (
    <div className="space-y-6">
      {/* 操作栏 */}
      <div className="flex flex-wrap gap-4 justify-between items-center">
        <div className="flex gap-2">
          <Select
            options={[
              { value: 'ALL', label: t('inventory.reservation.all_status', '全部状态') },
              { value: 'ACTIVE', label: t('inventory.reservation.status.active', '预订中') },
              { value: 'FULFILLED', label: t('inventory.reservation.status.fulfilled', '已完成') },
              { value: 'CANCELLED', label: t('inventory.reservation.status.cancelled', '已取消') },
              { value: 'EXPIRED', label: t('inventory.reservation.status.expired', '已过期') },
            ]}
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value as ReservationStatus | 'ALL')}
            fullWidth={false}
            className="w-36"
          />
        </div>

        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} className="mr-2" />
          {t('inventory.reservation.create', '创建预订')}
        </Button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-warning-light flex items-center justify-center">
              <Package size={20} className="text-warning-text" />
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">
                {reservations.filter(r => r.status === 'ACTIVE').length}
              </div>
              <div className="text-sm text-gray-500">
                {t('inventory.reservation.active_count', '预订中')}
              </div>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-success-light flex items-center justify-center">
              <Package size={20} className="text-success-text" />
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">
                {reservations.filter(r => r.status === 'FULFILLED').length}
              </div>
              <div className="text-sm text-gray-500">
                {t('inventory.reservation.fulfilled_count', '已完成')}
              </div>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-danger-light flex items-center justify-center">
              <AlertTriangle size={20} className="text-danger-text" />
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">
                {reservations.filter(r => r.status === 'EXPIRED').length}
              </div>
              <div className="text-sm text-gray-500">
                {t('inventory.reservation.expired_count', '已过期')}
              </div>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-light flex items-center justify-center">
              <Package size={20} className="text-brand" />
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">
                {reservations
                  .filter(r => r.status === 'ACTIVE')
                  .reduce((sum, r) => sum + r.quantity, 0)}
              </div>
              <div className="text-sm text-gray-500">
                {t('inventory.reservation.total_qty', '总预订数量')}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* 预订列表 */}
      <Card noPadding>
        <div className="overflow-hidden rounded-lg">
          <DataTable<Reservation>
            data={filteredReservations}
            rowKey="id"
            columns={[
              {
                key: 'sku',
                header: t('inventory.reservation.sku', 'SKU'),
                accessor: 'sku',
                render: (_, reservation) => (
                  <div>
                    <div className="font-medium text-primary">{reservation.sku}</div>
                    <div className="text-xs text-gray-500">{reservation.productName}</div>
                  </div>
                ),
              },
              {
                key: 'warehouseName',
                header: t('inventory.reservation.warehouse', '仓库'),
                accessor: 'warehouseName',
                render: (_, r) => <span className="text-gray-600 text-sm">{r.warehouseName}</span>,
              },
              {
                key: 'quantity',
                header: t('inventory.reservation.quantity', '数量'),
                accessor: 'quantity',
                render: (_, r) => <span className="font-bold text-primary">{r.quantity}</span>,
              },
              {
                key: 'status',
                header: t('inventory.reservation.status', '状态'),
                accessor: 'status',
                render: (_, r) => {
                  const statusConfig = STATUS_CONFIG[r.status];
                  return (
                    <Badge variant={statusConfig.variant}>
                      {t(
                        `inventory.reservation.status.${r.status.toLowerCase()}`,
                        statusConfig.label
                      )}
                    </Badge>
                  );
                },
              },
              {
                key: 'expiresAt',
                header: t('inventory.reservation.expires', '过期时间'),
                accessor: 'expiresAt',
                render: (_, r) =>
                  r.expiresAt ? (
                    <span className="flex items-center gap-1 text-sm text-gray-500">
                      <Calendar size={12} />
                      {dateUtils.formatDate(r.expiresAt)}
                    </span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  ),
              },
              {
                key: 'createdAt',
                header: t('inventory.reservation.created', '创建'),
                accessor: 'createdAt',
                render: (_, r) => (
                  <div className="text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <User size={12} />
                      {r.createdByName}
                    </div>
                    <div className="flex items-center gap-1 text-xs mt-0.5">
                      <Clock size={10} />
                      {dateUtils.formatDate(r.createdAt)}
                    </div>
                  </div>
                ),
              },
              {
                key: 'actions',
                header: t('common.actions', '操作'),
                accessor: 'id',
                render: (_, r) =>
                  r.status === 'ACTIVE' ? (
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onFulfillReservation(r.id)}
                      >
                        {t('inventory.reservation.fulfill', '完成')}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onCancelReservation(r.id)}
                        className="text-gray-400 hover:text-danger-text px-2"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  ) : null,
              },
            ]}
            emptyText={t('inventory.reservation.empty', '暂无预订')}
          />
        </div>
      </Card>

      {/* 创建预订模态框 */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          resetForm();
          setIsModalOpen(false);
        }}
        title={t('inventory.reservation.create_title', '创建库存预订')}
        className="max-w-lg"
      >
        <div className="space-y-4">
          <Select
            label={t('inventory.reservation.select_sku', '选择商品')}
            options={[
              { value: '', label: t('inventory.reservation.select_sku_placeholder', '请选择商品') },
              ...productOptions,
            ]}
            value={newSku}
            onChange={e => setNewSku(e.target.value)}
          />

          <Select
            label={t('inventory.reservation.select_warehouse', '选择仓库')}
            options={warehouseOptions}
            value={newWarehouseId}
            onChange={e => setNewWarehouseId(e.target.value)}
          />

          <Input
            label={t('inventory.reservation.quantity', '预订数量')}
            type="number"
            min={1}
            value={newQuantity}
            onChange={e => setNewQuantity(parseInt(e.target.value) || 1)}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('inventory.reservation.expires_at', '过期时间（可选）')}
            </label>
            <Input
              type="date"
              value={newExpiresAt}
              onChange={e => setNewExpiresAt(e.target.value)}
              fullWidth
            />
          </div>

          <Textarea
            label={t('inventory.reservation.remarks', '备注')}
            value={newRemarks}
            onChange={e => setNewRemarks(e.target.value)}
            rows={2}
          />

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="secondary"
              onClick={() => {
                resetForm();
                setIsModalOpen(false);
              }}
            >
              {t('common.cancel', '取消')}
            </Button>
            <Button variant="primary" onClick={handleSubmit} disabled={!newSku || !newWarehouseId}>
              {t('common.save', '保存')}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
