import React from 'react';
import { ArrowUp, ArrowDown, Trash2, Plus, AlertTriangle } from 'lucide-react';
import { Recommendation, Product, Tenant, StockStatus } from '../../../types';
import { Card } from '../../../components/common/Card';
import { Badge } from '../../../components/common/Badge';
import { Toggle } from '../../../components/Toggle';
import { useTranslation } from 'react-i18next';
import { Button, Select } from '../../../components/ui';
import { AnimatedBox } from '../../../components/motion';
import { Tooltip } from '../../../components/primitives';

interface RecsListProps {
  mode: 'GLOBAL' | 'STORE';
  recommendations: Recommendation[]; // 已排序的推荐列表
  products: Product[];
  tenants: Tenant[];
  currentUserRole: string;
  selectedTenantId: string;
  setSelectedTenantId: (id: string) => void;
  getStock: (productId: string, tenantId: string) => StockStatus;
  onOpenAddModal: () => void;
  onMovePriority: (rec: Recommendation, direction: 'up' | 'down') => void;
  onToggle: (id: string, current: boolean) => void;
  onDelete: (id: string) => void;
}

export const RecsList: React.FC<RecsListProps> = ({
  mode,
  recommendations,
  products,
  tenants,
  currentUserRole,
  selectedTenantId,
  setSelectedTenantId,
  getStock,
  onOpenAddModal,
  onMovePriority,
  onToggle,
  onDelete
}) => {
  const { t } = useTranslation();

  const storeOptions = tenants.filter(tn => tn.type === 'STORE').map(tn => ({ value: tn.id, label: tn.name }));

  return (
    <div className="space-y-6">
      {mode === 'STORE' && (
        <AnimatedBox animation="fadeInDown" className="bg-primary-light border border-blue-100 text-primary px-4 py-3 rounded-lg text-sm flex items-start gap-2">
          <AlertTriangle size={16} className="mt-0.5" />
          <div>
            <strong>{t('recs.override_rule')}:</strong> {t('recs.override_desc')}
          </div>
        </AnimatedBox>
      )}

      <AnimatedBox animation="fadeInUp">
        <Card noPadding>
          <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-bold text-primary">
                {mode === 'GLOBAL' ? t('recs.global_title') : t('recs.store_title')}
              </h2>
              {mode === 'STORE' && (
                <Select
                  options={storeOptions}
                  value={selectedTenantId}
                  onChange={(e) => setSelectedTenantId(e.target.value)}
                  disabled={currentUserRole === 'STORE_MANAGER'}
                  fullWidth={false}
                  className="min-w-[180px]"
                />
              )}
            </div>
            <Button variant="primary" onClick={onOpenAddModal}>
              <Plus size={16} className="mr-2" />
              {t('recs.add_product')}
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="py-4 px-6 w-16">{t('recs.table.priority')}</th>
                  <th className="py-4 px-6">{t('recs.table.product')}</th>
                  <th className="py-4 px-6 w-32">{t('recs.table.status')}</th>
                  {mode === 'STORE' && <th className="py-4 px-6 w-32">{t('recs.table.stock')}</th>}
                  <th className="py-4 px-6 w-48">{t('recs.table.schedule')}</th>
                  <th className="py-4 px-6 w-24">{t('recs.table.active')}</th>
                  <th className="py-4 px-6 w-24 text-right">{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recommendations.map((rec, index) => {
                  const product = products.find(p => p.id === rec.productId);
                  if (!product) return null;
                  const stock = mode === 'STORE' ? getStock(product.id, selectedTenantId) : null;

                  return (
                    <tr key={rec.id} className="group hover:bg-gray-50/40">
                      <td className="py-4 px-6">
                        <div className="flex flex-col items-center gap-1">
                          <Tooltip content={t('common.move_up')}>
                            <button onClick={() => onMovePriority(rec, 'up')} disabled={index === 0} className="text-gray-400 hover:text-gray-600 disabled:opacity-30"><ArrowUp size={14} /></button>
                          </Tooltip>
                          <span className="font-mono text-xs font-medium text-primary">{rec.priority}</span>
                          <Tooltip content={t('common.move_down')}>
                            <button onClick={() => onMovePriority(rec, 'down')} disabled={index === recommendations.length - 1} className="text-gray-400 hover:text-gray-600 disabled:opacity-30"><ArrowDown size={14} /></button>
                          </Tooltip>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded bg-gray-100 flex-shrink-0">
                            <img src={product.imageUrl} className="w-full h-full object-cover rounded" />
                          </div>
                          <div>
                            <div className="font-medium text-primary text-sm">{product.name}</div>
                            <div className="text-xs text-muted">{product.sku}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <Badge variant={product.globalStatus === 'ON_SHELF' ? 'success' : 'neutral'}>
                          {t(`consts.status.${product.globalStatus}`)}
                        </Badge>
                      </td>
                      {mode === 'STORE' && (
                        <td className="py-4 px-6">
                          <Badge variant={stock === 'IN_STOCK' ? 'success' : stock === 'UNAVAILABLE' ? 'danger' : 'warning'}>
                            {stock ? t(`consts.stock.${stock}`) : '-'}
                          </Badge>
                        </td>
                      )}
                      <td className="py-4 px-6 text-xs text-muted">
                        <div>{rec.startAt}</div>
                        <div className="text-gray-400">to {rec.endAt}</div>
                      </td>
                      <td className="py-4 px-6">
                        <Toggle enabled={rec.isEnabled} onToggle={() => onToggle(rec.id, !rec.isEnabled)} />
                      </td>
                      <td className="py-4 px-6 text-right">
                        <Tooltip content={t('common.delete')}>
                          <button
                            onClick={() => onDelete(rec.id)}
                            className="text-gray-400 hover:text-danger transition-colors p-1"
                          >
                            <Trash2 size={16} />
                          </button>
                        </Tooltip>
                      </td>
                    </tr>
                  );
                })}
                {recommendations.length === 0 && (
                  <tr>
                    <td colSpan={10} className="py-8 text-center text-sm text-muted">
                      {t('common.no_data')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </AnimatedBox>
    </div>
  );
};