import React, { memo } from 'react';
import { Product } from '../../pim/types';
import { Warehouse, InventoryBalance as InventoryRecord } from '../types';
import { Card } from '../../../components/common/Card';
import { Badge } from '../../../components/common/Badge';
import { Tooltip } from '../../../components/primitives';

import {
  ClipboardList,
  PackagePlus,
  ArrowRightLeft,
  MapPin,
  Truck,
  Lock,
  PackageMinus,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface StockSkuCardProps {
  product: Product;
  warehouses: Warehouse[];
  inventory: InventoryRecord[]; // Pass all or filtered? Passing all allows component to derive.
  currentUserRole: string;
  lowStockThreshold: number;
  onSetHistorySku: (sku: string) => void;
  onSetActionModal: (action: {
    type: 'RECEIVE' | 'ISSUE' | 'TRANSFER' | 'RESERVE';
    sku: string;
    whId?: string;
  }) => void;
  getStock: (
    sku: string,
    whId: string
  ) =>
    | InventoryRecord
    | { onHand: number; reserved: number; inTransitIn: number; inTransitOut: number };
  getTotalStock: (sku: string) => number;
}

export const StockSkuCard: React.FC<StockSkuCardProps> = memo(
  ({
    product,
    warehouses,
    currentUserRole,
    lowStockThreshold,
    onSetHistorySku,
    onSetActionModal,
    getStock,
    getTotalStock,
  }) => {
    const { t } = useTranslation();
    const total = getTotalStock(product.sku);

    return (
      <Card noPadding className="overflow-hidden group">
        <div className="p-4 bg-gray-50/50 border-b border-gray-100 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded border border-gray-200 p-1 relative">
              <img
                src={product.imageUrl}
                className="w-full h-full object-cover rounded"
                alt={product.name}
              />
            </div>
            <div>
              <div className="font-bold text-sm text-primary">{product.name}</div>
              <div className="font-mono text-xs text-gray-500">{product.sku}</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs text-gray-500 uppercase font-bold">
                {t('inventory.table.total_on_hand')}
              </div>
              <div
                className={`text-lg font-bold ${total <= lowStockThreshold ? 'text-warning-text' : 'text-primary'}`}
              >
                {total}
              </div>
            </div>
            {currentUserRole !== 'STORE_STAFF' && (
              <div className="flex gap-2">
                <Tooltip content={t('common.details')}>
                  <button
                    onClick={() => onSetHistorySku(product.sku)}
                    className="p-2 bg-white border border-gray-200 rounded hover:bg-gray-100 text-gray-600"
                  >
                    <ClipboardList size={16} />
                  </button>
                </Tooltip>
                <Tooltip content={t('inventory.restock')}>
                  <button
                    onClick={() => onSetActionModal({ type: 'RECEIVE', sku: product.sku })}
                    className="p-2 bg-white border border-gray-200 rounded hover:bg-gray-100 text-success"
                  >
                    <PackagePlus size={16} />
                  </button>
                </Tooltip>
                <Tooltip content={t('inventory.actions.transfer')}>
                  <button
                    onClick={() => onSetActionModal({ type: 'TRANSFER', sku: product.sku })}
                    className="p-2 bg-white border border-gray-200 rounded hover:bg-gray-100 text-brand"
                  >
                    <ArrowRightLeft size={16} />
                  </button>
                </Tooltip>
              </div>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-white text-gray-500 border-b border-gray-100">
                <th className="py-2 px-4 font-normal">{t('inventory.table.warehouse')}</th>
                <th className="py-2 px-4 font-normal">{t('inventory.table.on_hand')}</th>
                <th className="py-2 px-4 font-normal">{t('inventory.table.reserved')}</th>
                <th className="py-2 px-4 font-normal">{t('inventory.table.available')}</th>
                <th className="py-2 px-4 font-normal">{t('common.status')}</th>
                <th className="py-2 px-4 font-normal text-right">{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {warehouses.map(wh => {
                const stock = getStock(product.sku, wh.id);
                const available = Math.max(0, stock.onHand - stock.reserved);
                const hasIncoming = stock.inTransitIn && stock.inTransitIn > 0;

                let statusKey = 'UNAVAILABLE';
                let variant: 'success' | 'warning' | 'default' | 'neutral' = 'neutral';
                if (available > 0) {
                  statusKey = 'IN_STOCK';
                  variant = 'success';
                } else if (product.allowBackorder) {
                  statusKey = 'BACKORDER';
                  variant = 'warning';
                } else if (product.allowTransfer) {
                  statusKey = 'TRANSFERABLE';
                  variant = 'default';
                }

                return (
                  <tr
                    key={wh.id}
                    className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50"
                  >
                    <td className="py-3 px-4 flex items-center gap-2 text-primary">
                      <MapPin size={14} className="text-gray-400" />
                      {wh.name}
                      {wh.type === 'DC' && (
                        <span className="text-[10px] bg-gray-200 px-1 rounded text-gray-600">
                          {t('consts.warehouse_type.DC')}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono">
                      {stock.onHand}
                      {hasIncoming && (
                        <span
                          className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-purple-100 text-purple-700"
                          title={`${stock.inTransitIn} incoming`}
                        >
                          <Truck size={10} className="mr-1" /> +{stock.inTransitIn}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-gray-400">{stock.reserved}</td>
                    <td className="py-3 px-4 font-mono font-bold">{available}</td>
                    <td className="py-3 px-4">
                      <Badge variant={variant}>{t(`consts.stock.${statusKey}`)}</Badge>
                    </td>
                    <td className="py-3 px-4 text-right flex items-center justify-end gap-2">
                      {(stock.onHand > 0 || currentUserRole === 'SUPER_ADMIN') && (
                        <>
                          <Tooltip content={t('inventory.actions.reserve')}>
                            <button
                              onClick={() =>
                                onSetActionModal({ type: 'RESERVE', sku: product.sku, whId: wh.id })
                              }
                              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded opacity-0 group-hover:opacity-100 transition-all"
                            >
                              <Lock size={14} />
                            </button>
                          </Tooltip>
                          <Tooltip content={t('inventory.actions.issue')}>
                            <button
                              onClick={() =>
                                onSetActionModal({ type: 'ISSUE', sku: product.sku, whId: wh.id })
                              }
                              className="p-1.5 text-gray-400 hover:text-danger-text hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-all"
                            >
                              <PackageMinus size={14} />
                            </button>
                          </Tooltip>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    );
  }
);
