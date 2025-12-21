/**
 * 库存单据列表组件
 *
 * 显示入库/出库/调拨单据列表
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    FileText,
    ArrowDownCircle,
    ArrowUpCircle,
    ArrowLeftRight,
    Clock,
    CheckCircle,
    XCircle,
} from 'lucide-react';

import { Card } from '../../../components/common/Card';
import { Badge } from '../../../components/common/Badge';
import { Button } from '../../../components/ui';
import { EmptyState } from '../../../components/common/EmptyState';
import {
    InventoryDocument,
    DocumentType,
    DocumentStatus,
    TransferDocument,
} from '../types';

interface DocumentListProps {
    documents: InventoryDocument[];
    warehouses: { id: string; name: string }[];
    onViewDocument: (doc: InventoryDocument) => void;
    onCreateDocument: (type: DocumentType) => void;
}

// 状态配置
const STATUS_CONFIG: Record<DocumentStatus, { variant: 'success' | 'warning' | 'danger' | 'neutral'; icon: React.ElementType }> = {
    DRAFT: { variant: 'neutral', icon: FileText },
    PENDING: { variant: 'warning', icon: Clock },
    APPROVED: { variant: 'success', icon: CheckCircle },
    SHIPPED: { variant: 'warning', icon: ArrowLeftRight },
    RECEIVED: { variant: 'success', icon: CheckCircle },
    CANCELLED: { variant: 'danger', icon: XCircle },
};

// 类型图标
const TYPE_ICONS: Record<DocumentType, React.ElementType> = {
    RECEIVING: ArrowDownCircle,
    ISSUING: ArrowUpCircle,
    TRANSFER: ArrowLeftRight,
};

export const DocumentList: React.FC<DocumentListProps> = ({
    documents,
    warehouses,
    onViewDocument,
    onCreateDocument,
}) => {
    const { t } = useTranslation();
    const [filterType, setFilterType] = useState<DocumentType | 'ALL'>('ALL');
    const [filterStatus, setFilterStatus] = useState<DocumentStatus | 'ALL'>('ALL');

    // 仓库名称查找
    const getWarehouseName = (id: string) =>
        warehouses.find(w => w.id === id)?.name || id;

    // 筛选
    const filteredDocs = documents.filter(doc => {
        if (filterType !== 'ALL' && doc.type !== filterType) return false;
        if (filterStatus !== 'ALL' && doc.status !== filterStatus) return false;
        return true;
    });

    return (
        <div className="space-y-4">
            {/* 操作栏 */}
            <div className="flex flex-wrap gap-3 justify-between items-center">
                {/* 筛选 */}
                <div className="flex gap-2">
                    <select
                        value={filterType}
                        onChange={e => setFilterType(e.target.value as DocumentType | 'ALL')}
                        className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
                    >
                        <option value="ALL">{t('inventory.docs.all_types', '全部类型')}</option>
                        <option value="RECEIVING">{t('inventory.docs.receiving', '入库单')}</option>
                        <option value="ISSUING">{t('inventory.docs.issuing', '出库单')}</option>
                        <option value="TRANSFER">{t('inventory.docs.transfer', '调拨单')}</option>
                    </select>
                    <select
                        value={filterStatus}
                        onChange={e => setFilterStatus(e.target.value as DocumentStatus | 'ALL')}
                        className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
                    >
                        <option value="ALL">{t('inventory.docs.all_status', '全部状态')}</option>
                        <option value="DRAFT">{t('inventory.docs.status.draft', '草稿')}</option>
                        <option value="PENDING">{t('inventory.docs.status.pending', '待审批')}</option>
                        <option value="APPROVED">{t('inventory.docs.status.approved', '已审批')}</option>
                        <option value="SHIPPED">{t('inventory.docs.status.shipped', '已发货')}</option>
                        <option value="RECEIVED">{t('inventory.docs.status.received', '已收货')}</option>
                    </select>
                </div>

                {/* 创建按钮 */}
                <div className="flex gap-2">
                    <Button
                        variant="secondary"
                        onClick={() => onCreateDocument('RECEIVING')}
                    >
                        <ArrowDownCircle size={16} className="mr-2" />
                        {t('inventory.docs.new_receiving', '新建入库单')}
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => onCreateDocument('ISSUING')}
                    >
                        <ArrowUpCircle size={16} className="mr-2" />
                        {t('inventory.docs.new_issuing', '新建出库单')}
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => onCreateDocument('TRANSFER')}
                    >
                        <ArrowLeftRight size={16} className="mr-2" />
                        {t('inventory.docs.new_transfer', '新建调拨单')}
                    </Button>
                </div>
            </div>

            {/* 列表 */}
            <Card noPadding>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase">
                                <th className="py-4 px-6">{t('inventory.docs.doc_no', '单据编号')}</th>
                                <th className="py-4 px-6">{t('inventory.docs.type', '类型')}</th>
                                <th className="py-4 px-6">{t('inventory.docs.warehouse', '仓库')}</th>
                                <th className="py-4 px-6">{t('inventory.docs.items', '行数')}</th>
                                <th className="py-4 px-6">{t('inventory.docs.status', '状态')}</th>
                                <th className="py-4 px-6">{t('inventory.docs.created_at', '创建时间')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredDocs.map(doc => {
                                const TypeIcon = TYPE_ICONS[doc.type];
                                const statusConfig = STATUS_CONFIG[doc.status];
                                const StatusIcon = statusConfig.icon;

                                return (
                                    <tr
                                        key={doc.id}
                                        className="hover:bg-gray-50 cursor-pointer"
                                        onClick={() => onViewDocument(doc)}
                                    >
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2">
                                                <TypeIcon size={16} className="text-gray-400" />
                                                <span className="font-medium text-primary">{doc.documentNo}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-sm">
                                            {t(`inventory.docs.type_${doc.type.toLowerCase()}`, doc.type)}
                                        </td>
                                        <td className="py-4 px-6 text-sm text-gray-600">
                                            {doc.type === 'TRANSFER'
                                                ? `${getWarehouseName((doc as TransferDocument).fromWarehouseId)} → ${getWarehouseName((doc as TransferDocument).toWarehouseId)}`
                                                : getWarehouseName(doc.warehouseId)
                                            }
                                        </td>
                                        <td className="py-4 px-6 text-sm text-gray-600">
                                            {doc.lines.length} {t('inventory.docs.lines', '行')}
                                        </td>
                                        <td className="py-4 px-6">
                                            <Badge variant={statusConfig.variant}>
                                                <StatusIcon size={12} className="mr-1" />
                                                {t(`inventory.docs.status.${doc.status.toLowerCase()}`, doc.status)}
                                            </Badge>
                                        </td>
                                        <td className="py-4 px-6 text-sm text-gray-500">
                                            {new Date(doc.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                );
                            })}
                            {filteredDocs.length === 0 && (
                                <tr>
                                    <td colSpan={6}>
                                        <EmptyState
                                            title={t('inventory.docs.empty', '暂无单据')}
                                            description={t('inventory.docs.empty_desc', '点击上方按钮创建新的库存单据')}
                                        />
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};
