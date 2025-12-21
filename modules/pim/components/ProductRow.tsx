import React from 'react';
import { Product } from '../types';
import { Badge } from '../../../components/common/Badge';
import { Tooltip } from '../../../components/primitives';
import { Edit3, CheckSquare, Square } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ProductRowProps {
    product: Product;
    isSelected: boolean;
    onToggleSelection: (id: string) => void;
    onEdit: (product: Product) => void;
}

export const ProductRow: React.FC<ProductRowProps> = React.memo(({ product, isSelected, onToggleSelection, onEdit }) => {
    const { t } = useTranslation();

    return (
        <tr className={`hover:bg-gray-50/40 ${isSelected ? 'bg-brand-light/30' : ''}`}>
            <td className="py-4 px-6">
                <button onClick={() => onToggleSelection(product.id)} className={`text-gray-400 hover:text-gray-600 ${isSelected ? 'text-brand' : ''}`}>
                    {isSelected ? <CheckSquare size={16} /> : <Square size={16} />}
                </button>
            </td>
            <td className="py-4 px-6">
                <div className="w-10 h-10 rounded bg-gray-100">
                    <img src={product.imageUrl} className="w-full h-full object-cover rounded" alt={product.name} />
                </div>
            </td>
            <td className="py-4 px-6">
                <div className="font-medium text-primary text-sm">{product.name}</div>
                <div className="text-xs text-gray-500 font-mono">{product.sku}</div>
            </td>
            <td className="py-4 px-6 text-sm text-gray-600">{product.category}</td>
            <td className="py-4 px-6">
                <Badge variant={product.status === 'PUBLISHED' ? 'success' : product.status === 'DRAFT' ? 'warning' : 'neutral'}>
                    {t(`consts.status.${product.status}`)}
                </Badge>
            </td>
            <td className="py-4 px-6 text-xs space-y-1">
                <div className={product.allowBackorder ? 'text-success-text' : 'text-gray-400'}>{t('pim.table.backorder')}: {product.allowBackorder ? t('common.yes') : t('common.no')}</div>
                <div className={product.allowTransfer ? 'text-brand' : 'text-gray-400'}>{t('pim.table.transfer')}: {product.allowTransfer ? t('common.yes') : t('common.no')}</div>
            </td>
            <td className="py-4 px-6 text-right">
                <Tooltip content={t('common.edit')}>
                    <button onClick={() => onEdit(product)} className="text-gray-400 hover:text-brand"><Edit3 size={16} /></button>
                </Tooltip>
            </td>
        </tr>
    );
});
