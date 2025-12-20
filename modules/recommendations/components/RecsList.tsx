import React from 'react';
import { ArrowUp, ArrowDown, Trash2, Plus, AlertTriangle } from 'lucide-react';
import { Recommendation, Product, Tenant, StockStatus } from '../../../types';
import { Card } from '../../../components/common/Card';
import { Badge } from '../../../components/common/Badge';
import { Toggle } from '../../../components/Toggle';
import { useTranslation } from 'react-i18next';

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

/**
 * 推荐列表组件 (RecsList)
 * 职责:
 * 1. 展示当前作用域 (Global/Store) 下的推荐商品
 * 2. 提供排序功能 (上下移动优先级)
 * 3. 提供启停控制 (Toggle) 和 删除功能
 * 4. 显示业务规则提示 (如门店配置覆盖规则)
 */
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

  return (
    <div className="space-y-6">
      {/* 覆盖规则提示: 仅在门店模式显示 */}
      {mode === 'STORE' && (
        <div className="bg-brand-light border border-blue-100 text-brand px-4 py-3 rounded-lg text-sm flex items-start gap-2 animate-in fade-in">
           <AlertTriangle size={16} className="mt-0.5" />
           <div>
             <strong>{t('recs.override_rule')}:</strong> {t('recs.override_desc')}
           </div>
        </div>
      )}

      <Card noPadding>
        {/* 列表头部: 标题、门店选择器和添加按钮 */}
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
             <h2 className="text-lg font-bold text-primary">
               {mode === 'GLOBAL' ? t('recs.global_title') : t('recs.store_title')}
             </h2>
             {mode === 'STORE' && (
                // 门店选择器: 店长不可选 (固定为自己门店)，管理员/运营可选
                <select 
                  value={selectedTenantId}
                  onChange={(e) => setSelectedTenantId(e.target.value)}
                  disabled={currentUserRole === 'STORE_MANAGER'}
                  className="bg-gray-50 border border-gray-200 text-sm rounded-lg p-2 outline-none focus:ring-2 focus:ring-gray-200"
                >
                  {tenants.filter(t => t.type === 'STORE').map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
             )}
          </div>
          <button 
            onClick={onOpenAddModal}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
          >
            <Plus size={16} />
            {t('recs.add_product')}
          </button>
        </div>

        {/* 推荐商品表格 */}
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
                // 在门店模式下，计算该商品在本店的实时库存状态
                const stock = mode === 'STORE' ? getStock(product.id, selectedTenantId) : null;

                return (
                  <tr key={rec.id} className="group hover:bg-gray-50/40">
                    {/* 优先级排序 */}
                    <td className="py-4 px-6">
                      <div className="flex flex-col items-center gap-1">
                        <button onClick={() => onMovePriority(rec, 'up')} disabled={index === 0} className="text-gray-400 hover:text-gray-600 disabled:opacity-30"><ArrowUp size={14}/></button>
                        <span className="font-mono text-xs font-medium text-primary">{rec.priority}</span>
                        <button onClick={() => onMovePriority(rec, 'down')} disabled={index === recommendations.length -1} className="text-gray-400 hover:text-gray-600 disabled:opacity-30"><ArrowDown size={14}/></button>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded bg-gray-100 flex-shrink-0">
                           <img src={product.imageUrl} className="w-full h-full object-cover rounded" />
                         </div>
                         <div>
                           <div className="font-medium text-primary text-sm">{product.name}</div>
                           <div className="text-xs text-gray-500">{product.sku}</div>
                         </div>
                      </div>
                    </td>
                    {/* 全局上下架状态 */}
                    <td className="py-4 px-6">
                       <Badge variant={product.globalStatus === 'ON_SHELF' ? 'success' : 'neutral'}>
                         {t(`consts.status.${product.globalStatus}`)}
                       </Badge>
                    </td>
                    {/* 门店库存状态 (仅门店模式) */}
                    {mode === 'STORE' && (
                       <td className="py-4 px-6">
                          <Badge variant={stock === 'IN_STOCK' ? 'success' : stock === 'UNAVAILABLE' ? 'danger' : 'warning'}>
                            {stock ? t(`consts.stock.${stock}`) : '-'}
                          </Badge>
                       </td>
                    )}
                    <td className="py-4 px-6 text-xs text-gray-500">
                      <div>{rec.startAt}</div>
                      <div className="text-gray-400">to {rec.endAt}</div>
                    </td>
                    <td className="py-4 px-6">
                      <Toggle enabled={rec.isEnabled} onToggle={() => onToggle(rec.id, !rec.isEnabled)} />
                    </td>
                    <td className="py-4 px-6 text-right">
                       <button 
                        onClick={() => onDelete(rec.id)}
                        className="text-gray-400 hover:text-danger-text transition-colors p-1"
                       >
                         <Trash2 size={16} />
                       </button>
                    </td>
                  </tr>
                );
              })}
              {recommendations.length === 0 && (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-sm text-gray-400">
                    {t('common.no_data')}
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