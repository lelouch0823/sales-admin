/**
 * 库存单据编辑模态框
 *
 * 用于创建和编辑入库/出库/调拨单据
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Trash2 } from 'lucide-react';

import { Modal } from '../../../components/common/Modal';
import { Button, Select, Textarea } from '../../../components/ui';
import {
    InventoryDocument,
    DocumentType,
    DocumentLine,
    ReceivingDocument,
    IssuingDocument,
    TransferDocument,
} from '../types';

interface DocumentEditorProps {
    isOpen: boolean;
    onClose: () => void;
    type: DocumentType;
    warehouses: { id: string; name: string }[];
    products: { sku: string; name: string }[];
    onSave: (document: Partial<InventoryDocument>) => void;
    initialData?: InventoryDocument | null;
}

const generateDocNo = (type: DocumentType) => {
    const prefix = type === 'RECEIVING' ? 'RCV' : type === 'ISSUING' ? 'ISS' : 'TRF';
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}${date}${random}`;
};

export const DocumentEditor: React.FC<DocumentEditorProps> = ({
    isOpen,
    onClose,
    type,
    warehouses,
    products,
    onSave,
    initialData,
}) => {
    const { t } = useTranslation();

    // 表单状态
    const [warehouseId, setWarehouseId] = useState('');
    const [fromWarehouseId, setFromWarehouseId] = useState('');
    const [toWarehouseId, setToWarehouseId] = useState('');
    const [lines, setLines] = useState<DocumentLine[]>([]);
    const [remarks, setRemarks] = useState('');
    const [sourceType, setSourceType] = useState<'PURCHASE' | 'RETURN' | 'OTHER'>('PURCHASE');
    const [issueType, setIssueType] = useState<'SALE' | 'DAMAGE' | 'OTHER'>('SALE');

    // 初始化
    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setWarehouseId(initialData.warehouseId);
                setLines(initialData.lines);
                setRemarks(initialData.remarks || '');
                if (initialData.type === 'TRANSFER') {
                    setFromWarehouseId((initialData as TransferDocument).fromWarehouseId);
                    setToWarehouseId((initialData as TransferDocument).toWarehouseId);
                }
                if (initialData.type === 'RECEIVING') {
                    setSourceType((initialData as ReceivingDocument).sourceType);
                }
                if (initialData.type === 'ISSUING') {
                    setIssueType((initialData as IssuingDocument).issueType);
                }
            } else {
                // 重置表单
                setWarehouseId(warehouses[0]?.id || '');
                setFromWarehouseId(warehouses[0]?.id || '');
                setToWarehouseId(warehouses[1]?.id || warehouses[0]?.id || '');
                setLines([]);
                setRemarks('');
                setSourceType('PURCHASE');
                setIssueType('SALE');
            }
        }
    }, [isOpen, initialData, warehouses]);

    // 添加行
    const addLine = () => {
        const newLine: DocumentLine = {
            id: Math.random().toString(36).substr(2, 9),
            sku: '',
            productName: '',
            quantity: 1,
        };
        setLines([...lines, newLine]);
    };

    // 更新行
    const updateLine = (id: string, updates: Partial<DocumentLine>) => {
        setLines(lines.map(line =>
            line.id === id ? { ...line, ...updates } : line
        ));
    };

    // 删除行
    const removeLine = (id: string) => {
        setLines(lines.filter(line => line.id !== id));
    };

    // 选择商品
    const selectProduct = (lineId: string, sku: string) => {
        const product = products.find(p => p.sku === sku);
        if (product) {
            updateLine(lineId, { sku: product.sku, productName: product.name });
        }
    };

    // 保存
    const handleSave = () => {
        if (lines.length === 0) {
            alert(t('inventory.docs.error_no_lines', '请添加至少一个商品'));
            return;
        }

        const baseDoc: Partial<InventoryDocument> = {
            id: initialData?.id || Math.random().toString(36).substr(2, 9),
            documentNo: initialData?.documentNo || generateDocNo(type),
            type,
            status: 'DRAFT',
            warehouseId: type === 'TRANSFER' ? fromWarehouseId : warehouseId,
            lines,
            remarks,
            createdAt: initialData?.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        if (type === 'TRANSFER') {
            (baseDoc as Partial<TransferDocument>).fromWarehouseId = fromWarehouseId;
            (baseDoc as Partial<TransferDocument>).toWarehouseId = toWarehouseId;
        }
        if (type === 'RECEIVING') {
            (baseDoc as Partial<ReceivingDocument>).sourceType = sourceType;
        }
        if (type === 'ISSUING') {
            (baseDoc as Partial<IssuingDocument>).issueType = issueType;
        }

        onSave(baseDoc);
        onClose();
    };

    const typeLabels: Record<DocumentType, string> = {
        RECEIVING: t('inventory.docs.receiving', '入库单'),
        ISSUING: t('inventory.docs.issuing', '出库单'),
        TRANSFER: t('inventory.docs.transfer', '调拨单'),
    };

    const warehouseOptions = warehouses.map(w => ({ value: w.id, label: w.name }));

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={initialData ? t('inventory.docs.edit', '编辑') + typeLabels[type] : t('inventory.docs.new', '新建') + typeLabels[type]}
            className="max-w-3xl"
        >
            <div className="space-y-6">
                {/* 仓库选择 */}
                <div className="grid grid-cols-2 gap-4">
                    {type === 'TRANSFER' ? (
                        <>
                            <Select
                                label={t('inventory.docs.from_warehouse', '源仓库')}
                                options={warehouseOptions}
                                value={fromWarehouseId}
                                onChange={e => setFromWarehouseId(e.target.value)}
                            />
                            <Select
                                label={t('inventory.docs.to_warehouse', '目标仓库')}
                                options={warehouseOptions}
                                value={toWarehouseId}
                                onChange={e => setToWarehouseId(e.target.value)}
                            />
                        </>
                    ) : (
                        <Select
                            label={t('inventory.docs.warehouse', '仓库')}
                            options={warehouseOptions}
                            value={warehouseId}
                            onChange={e => setWarehouseId(e.target.value)}
                        />
                    )}

                    {type === 'RECEIVING' && (
                        <Select
                            label={t('inventory.docs.source_type', '来源类型')}
                            options={[
                                { value: 'PURCHASE', label: t('inventory.docs.source.purchase', '采购入库') },
                                { value: 'RETURN', label: t('inventory.docs.source.return', '退货入库') },
                                { value: 'OTHER', label: t('inventory.docs.source.other', '其他') },
                            ]}
                            value={sourceType}
                            onChange={e => setSourceType(e.target.value as ReceivingDocument['sourceType'])}
                        />
                    )}

                    {type === 'ISSUING' && (
                        <Select
                            label={t('inventory.docs.issue_type', '出库类型')}
                            options={[
                                { value: 'SALE', label: t('inventory.docs.issue.sale', '销售出库') },
                                { value: 'DAMAGE', label: t('inventory.docs.issue.damage', '报损') },
                                { value: 'OTHER', label: t('inventory.docs.issue.other', '其他') },
                            ]}
                            value={issueType}
                            onChange={e => setIssueType(e.target.value as IssuingDocument['issueType'])}
                        />
                    )}
                </div>

                {/* 商品行 */}
                <div>
                    <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium">{t('inventory.docs.items', '商品明细')}</h4>
                        <Button variant="secondary" size="sm" onClick={addLine}>
                            <Plus size={14} className="mr-1" />
                            {t('inventory.docs.add_line', '添加行')}
                        </Button>
                    </div>

                    {lines.length === 0 ? (
                        <div className="p-8 text-center border-2 border-dashed rounded-lg text-gray-400">
                            {t('inventory.docs.no_lines', '点击"添加行"添加商品')}
                        </div>
                    ) : (
                        <div className="border rounded-lg overflow-hidden">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="py-2 px-4 text-left text-xs font-medium text-gray-500">SKU</th>
                                        <th className="py-2 px-4 text-left text-xs font-medium text-gray-500">{t('inventory.docs.product', '商品')}</th>
                                        <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 w-24">{t('inventory.docs.quantity', '数量')}</th>
                                        <th className="py-2 px-4 w-12"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {lines.map(line => (
                                        <tr key={line.id}>
                                            <td className="py-2 px-4">
                                                <select
                                                    value={line.sku}
                                                    onChange={e => selectProduct(line.id, e.target.value)}
                                                    className="w-full px-2 py-1 border rounded text-sm"
                                                >
                                                    <option value="">{t('inventory.docs.select_sku', '选择 SKU')}</option>
                                                    {products.map(p => (
                                                        <option key={p.sku} value={p.sku}>{p.sku}</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="py-2 px-4 text-gray-600">
                                                {line.productName || '-'}
                                            </td>
                                            <td className="py-2 px-4">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={line.quantity}
                                                    onChange={e => updateLine(line.id, { quantity: parseInt(e.target.value) || 1 })}
                                                    className="w-20 px-2 py-1 border rounded text-sm text-right"
                                                />
                                            </td>
                                            <td className="py-2 px-4">
                                                <button
                                                    onClick={() => removeLine(line.id)}
                                                    className="text-gray-400 hover:text-red-500"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* 备注 */}
                <Textarea
                    label={t('inventory.docs.remarks', '备注')}
                    value={remarks}
                    onChange={e => setRemarks(e.target.value)}
                    rows={2}
                />

                {/* 操作按钮 */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button variant="secondary" onClick={onClose}>
                        {t('common.cancel', '取消')}
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                        {t('common.save', '保存')}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
