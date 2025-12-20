import React from 'react';
import { Recommendation, Product, Tenant, StockStatus } from '../../types';
import { Badge } from '../common/Badge';
import { Card } from '../common/Card';
import { useTranslation } from 'react-i18next';
import { Select } from '../ui';

interface RecsPreviewProps {
  recommendations: Recommendation[];
  products: Product[];
  tenants: Tenant[];
  selectedTenantId: string;
  setSelectedTenantId: (id: string) => void;
  getStock: (productId: string, tenantId: string) => StockStatus;
}

export const RecsPreview: React.FC<RecsPreviewProps> = ({
  recommendations,
  products,
  tenants,
  selectedTenantId,
  setSelectedTenantId,
  getStock
}) => {
  const { t } = useTranslation();

  const storeOptions = tenants.filter(tn => tn.type === 'STORE').map(tn => ({ value: tn.id, label: tn.name }));

  return (
    <div className="space-y-6">
      <Card noPadding>
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold">{t('recs.preview.title')}</h2>
            <Select
              options={storeOptions}
              value={selectedTenantId}
              onChange={(e) => setSelectedTenantId(e.target.value)}
              fullWidth={false}
              className="min-w-[180px]"
            />
          </div>
          <Badge variant="neutral">{t('recs.preview.limit')}</Badge>
        </div>

        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {recommendations.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted">
              {t('recs.preview.no_active')}
            </div>
          )}
          {recommendations.map(rec => {
            const product = products.find(p => p.id === rec.productId);
            if (!product) return null;
            const stock = getStock(product.id, selectedTenantId);
            const isSourceStore = !!rec.tenantId;

            return (
              <div key={rec.id} className="border border-gray-200 rounded-lg overflow-hidden group hover:shadow-md transition-shadow">
                <div className="relative aspect-square bg-gray-100">
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2">
                    <Badge variant={stock === 'IN_STOCK' ? 'success' : stock === 'UNAVAILABLE' ? 'danger' : 'warning'}>
                      {t(`consts.stock.${stock}`)}
                    </Badge>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-sm truncate text-primary">{product.name}</h3>
                  <p className="text-xs text-muted mb-2">{product.brand}</p>
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isSourceStore ? "bg-primary-light text-primary" : "bg-gray-100 text-muted"}`}>
                      {isSourceStore ? t('recs.preview.store_config') : t('recs.preview.global_config')}
                    </span>
                    <span className="font-medium text-sm">${product.price}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  );
};