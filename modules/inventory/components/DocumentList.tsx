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

import { InventoryDocument, DocumentType, DocumentStatus, TransferDocument } from '../types';
import { DataTable } from '../../../components/common/DataTable';
import { Select } from '../../../components/ui';

interface DocumentListProps {
  documents: InventoryDocument[];
  warehouses: { id: string; name: string }[];
  onViewDocument: (doc: InventoryDocument) => void;
  onCreateDocument: (type: DocumentType) => void;
}

// 状态配置
const STATUS_CONFIG: Record<
  DocumentStatus,
  { variant: 'success' | 'warning' | 'danger' | 'neutral'; icon: React.ElementType }
> = {
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
  const getWarehouseName = (id: string) => warehouses.find(w => w.id === id)?.name || id;

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
        {/* 筛选 */}
        <div className="flex gap-2">
          <Select
            value={filterType}
            onChange={e => setFilterType(e.target.value as DocumentType | 'ALL')}
            options={[
              { value: 'ALL', label: t('inventory.docs.all_types', '全部类型') },
              { value: 'RECEIVING', label: t('inventory.docs.receiving', '入库单') },
              { value: 'ISSUING', label: t('inventory.docs.issuing', '出库单') },
              { value: 'TRANSFER', label: t('inventory.docs.transfer', '调拨单') },
            ]}
            className="w-32"
            fullWidth={false}
          />
          <Select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value as DocumentStatus | 'ALL')}
            options={[
              { value: 'ALL', label: t('inventory.docs.all_status', '全部状态') },
              { value: 'DRAFT', label: t('inventory.docs.status.draft', '草稿') },
              { value: 'PENDING', label: t('inventory.docs.status.pending', '待审批') },
              { value: 'APPROVED', label: t('inventory.docs.status.approved', '已审批') },
              { value: 'SHIPPED', label: t('inventory.docs.status.shipped', '已发货') },
              { value: 'RECEIVED', label: t('inventory.docs.status.received', '已收货') },
            ]}
            className="w-32"
            fullWidth={false}
          />
        </div>

        {/* 创建按钮 */}
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => onCreateDocument('RECEIVING')}>
            <ArrowDownCircle size={16} className="mr-2" />
            {t('inventory.docs.new_receiving', '新建入库单')}
          </Button>
          <Button variant="secondary" onClick={() => onCreateDocument('ISSUING')}>
            <ArrowUpCircle size={16} className="mr-2" />
            {t('inventory.docs.new_issuing', '新建出库单')}
          </Button>
          <Button variant="primary" onClick={() => onCreateDocument('TRANSFER')}>
            <ArrowLeftRight size={16} className="mr-2" />
            {t('inventory.docs.new_transfer', '新建调拨单')}
          </Button>
        </div>
      </div>

      {/* 列表 */}
      <Card noPadding>
        <div className="overflow-hidden rounded-lg">
          <DataTable<InventoryDocument>
            data={filteredDocs}
            rowKey="id"
            columns={[
              {
                key: 'documentNo',
                header: t('inventory.docs.doc_no', '单据编号'),
                accessor: 'documentNo',
                render: (_, doc) => {
                  const TypeIcon = TYPE_ICONS[doc.type];
                  return (
                    <div className="flex items-center gap-2">
                      <TypeIcon size={16} className="text-gray-400" />
                      <span className="font-medium text-primary">{doc.documentNo}</span>
                    </div>
                  );
                },
              },
              {
                key: 'type',
                header: t('inventory.docs.type', '类型'),
                accessor: 'type',
                render: (_, doc) => t(`inventory.docs.type_${doc.type.toLowerCase()}`, doc.type),
              },
              {
                key: 'warehouseId',
                header: t('inventory.docs.warehouse', '仓库'),
                accessor: 'warehouseId',
                render: (_, doc) => (
                  <span className="text-gray-600">
                    {doc.type === 'TRANSFER'
                      ? `${getWarehouseName((doc as TransferDocument).fromWarehouseId)} → ${getWarehouseName((doc as TransferDocument).toWarehouseId)}`
                      : getWarehouseName(doc.warehouseId)}
                  </span>
                ),
              },
              {
                key: 'lines',
                header: t('inventory.docs.items', '行数'),
                accessor: 'lines',
                render: (_, doc) => (
                  <span className="text-gray-600">
                    {doc.lines.length} {t('inventory.docs.lines', '行')}
                  </span>
                ),
              },
              {
                key: 'status',
                header: t('inventory.docs.status', '状态'),
                accessor: 'status',
                render: (_, doc) => {
                  const statusConfig = STATUS_CONFIG[doc.status];
                  const StatusIcon = statusConfig.icon;
                  return (
                    <Badge variant={statusConfig.variant}>
                      <StatusIcon size={12} className="mr-1" />
                      {t(`inventory.docs.status.${doc.status.toLowerCase()}`, doc.status)}
                    </Badge>
                  );
                },
              },
              {
                key: 'createdAt',
                header: t('inventory.docs.created_at', '创建时间'),
                accessor: 'createdAt',
                render: (_, doc) => (
                  <span className="text-gray-500">
                    {new Date(doc.createdAt).toLocaleDateString()}
                  </span>
                ),
              },
            ]}
            onRowClick={onViewDocument}
            emptyText={t('inventory.docs.empty', '暂无单据')}
          />
        </div>
      </Card>
    </div>
  );
};
