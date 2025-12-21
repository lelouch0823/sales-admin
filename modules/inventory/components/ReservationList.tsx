/**
 * 库存预订管理组件
 *
 * 管理 SKU 的预订/占用
 * 符合 UI 设计规范
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Package,
    Plus,
    Trash2,
    Calendar,
    User,
    Clock,
    AlertTriangle,
} from 'lucide-react';

import { Card } from '../../../components/common/Card';
import { Badge } from '../../../components/common/Badge';
import { Button, Input, Select, Textarea } from '../../../components/ui';
import { Modal } from '../../../components/common/Modal';
import { EmptyState } from '../../../components/common/EmptyState';

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
const STATUS_CONFIG: Record<ReservationStatus, { variant: 'success' | 'warning' | 'danger' | 'neutral'; label: string }> = {
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
    const filteredReservations = reservations.filter(r =>
        filterStatus === 'ALL' || r.status === filterStatus
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

    // 格式化日期
    const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString();

    const warehouseOptions = warehouses.map(w => ({ value: w.id, label: w.name }));
    const productOptions = products.map(p => ({ value: p.sku, label: `${p.sku} - ${p.name}` }));

    return (
        <div className="space-y-6">
            {/* 操作栏 */}
            <div className="flex flex-wrap gap-4 justify-between items-center">
                <div className="flex gap-2">
                    <select
                        value={filterStatus}
                        onChange={e => setFilterStatus(e.target.value as ReservationStatus | 'ALL')}
                        className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
                    >
                        <option value="ALL">{t('inventory.reservation.all_status', '全部状态')}</option>
                        <option value="ACTIVE">{t('inventory.reservation.status.active', '预订中')}</option>
                        <option value="FULFILLED">{t('inventory.reservation.status.fulfilled', '已完成')}</option>
                        <option value="CANCELLED">{t('inventory.reservation.status.cancelled', '已取消')}</option>
                        <option value="EXPIRED">{t('inventory.reservation.status.expired', '已过期')}</option>
                    </select>
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
                            <div className="text-sm text-gray-500">{t('inventory.reservation.active_count', '预订中')}</div>
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
                            <div className="text-sm text-gray-500">{t('inventory.reservation.fulfilled_count', '已完成')}</div>
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
                            <div className="text-sm text-gray-500">{t('inventory.reservation.expired_count', '已过期')}</div>
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
                                {reservations.filter(r => r.status === 'ACTIVE').reduce((sum, r) => sum + r.quantity, 0)}
                            </div>
                            <div className="text-sm text-gray-500">{t('inventory.reservation.total_qty', '总预订数量')}</div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* 预订列表 */}
            <Card noPadding>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase">
                                <th className="py-4 px-6">{t('inventory.reservation.sku', 'SKU')}</th>
                                <th className="py-4 px-6">{t('inventory.reservation.warehouse', '仓库')}</th>
                                <th className="py-4 px-6">{t('inventory.reservation.quantity', '数量')}</th>
                                <th className="py-4 px-6">{t('inventory.reservation.status', '状态')}</th>
                                <th className="py-4 px-6">{t('inventory.reservation.expires', '过期时间')}</th>
                                <th className="py-4 px-6">{t('inventory.reservation.created', '创建')}</th>
                                <th className="py-4 px-6 text-right">{t('common.actions', '操作')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredReservations.map(reservation => {
                                const statusConfig = STATUS_CONFIG[reservation.status];

                                return (
                                    <tr key={reservation.id} className="hover:bg-gray-50">
                                        <td className="py-4 px-6">
                                            <div className="font-medium text-primary">{reservation.sku}</div>
                                            <div className="text-xs text-gray-500">{reservation.productName}</div>
                                        </td>
                                        <td className="py-4 px-6 text-sm text-gray-600">
                                            {reservation.warehouseName}
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="font-bold text-primary">{reservation.quantity}</span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <Badge variant={statusConfig.variant}>
                                                {t(`inventory.reservation.status.${reservation.status.toLowerCase()}`, statusConfig.label)}
                                            </Badge>
                                        </td>
                                        <td className="py-4 px-6 text-sm text-gray-500">
                                            {reservation.expiresAt ? (
                                                <span className="flex items-center gap-1">
                                                    <Calendar size={12} />
                                                    {formatDate(reservation.expiresAt)}
                                                </span>
                                            ) : '-'}
                                        </td>
                                        <td className="py-4 px-6 text-sm text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <User size={12} />
                                                {reservation.createdByName}
                                            </div>
                                            <div className="flex items-center gap-1 text-xs">
                                                <Clock size={10} />
                                                {formatDate(reservation.createdAt)}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            {reservation.status === 'ACTIVE' && (
                                                <div className="flex gap-2 justify-end">
                                                    <Button
                                                        variant="secondary"
                                                        size="sm"
                                                        onClick={() => onFulfillReservation(reservation.id)}
                                                    >
                                                        {t('inventory.reservation.fulfill', '完成')}
                                                    </Button>
                                                    <button
                                                        onClick={() => onCancelReservation(reservation.id)}
                                                        className="text-gray-400 hover:text-danger-text"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                            {filteredReservations.length === 0 && (
                                <tr>
                                    <td colSpan={7}>
                                        <EmptyState
                                            title={t('inventory.reservation.empty', '暂无预订')}
                                            description={t('inventory.reservation.empty_desc', '点击"创建预订"添加新的库存预订')}
                                        />
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* 创建预订模态框 */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => { resetForm(); setIsModalOpen(false); }}
                title={t('inventory.reservation.create_title', '创建库存预订')}
                className="max-w-lg"
            >
                <div className="space-y-4">
                    <Select
                        label={t('inventory.reservation.select_sku', '选择商品')}
                        options={[{ value: '', label: t('inventory.reservation.select_sku_placeholder', '请选择商品') }, ...productOptions]}
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
                        <input
                            type="date"
                            value={newExpiresAt}
                            onChange={e => setNewExpiresAt(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                        />
                    </div>

                    <Textarea
                        label={t('inventory.reservation.remarks', '备注')}
                        value={newRemarks}
                        onChange={e => setNewRemarks(e.target.value)}
                        rows={2}
                    />

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button variant="secondary" onClick={() => { resetForm(); setIsModalOpen(false); }}>
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
