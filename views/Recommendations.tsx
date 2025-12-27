import React, { useState } from 'react';
import { useApp } from '../lib/context';
import { useToast } from '../lib/toast';
import { Recommendation, Product, StockStatus } from '../types';
import { RecsPreview } from '../modules/recommendations/components/RecsPreview';
import { RecsList } from '../modules/recommendations/components/RecsList';
import { RecsProductPicker } from '../modules/recommendations/components/RecsProductPicker';
import { useTranslation } from 'react-i18next';

interface RecsViewProps {
  mode: 'GLOBAL' | 'STORE' | 'PREVIEW';
}

export const RecommendationsView: React.FC<RecsViewProps> = ({ mode }) => {
  const {
    tenants,
    currentUser,
    recommendations,
    products,
    storeStock,
    addRecommendation,
    updateRecommendation,
    deleteRecommendation,
  } = useApp();
  const { t } = useTranslation();
  const toast = useToast();

  const [selectedTenantId, setSelectedTenantId] = useState<string>('');

  // Effect to set default tenant when data loads
  React.useEffect(() => {
    if ((mode === 'STORE' || mode === 'PREVIEW') && !selectedTenantId && tenants?.length > 0) {
      const storeTenant = tenants.find(t => t.type === 'STORE');
      const defaultId = currentUser?.tenantId || storeTenant?.id || '';
      if (defaultId) setSelectedTenantId(defaultId);
    }
  }, [mode, tenants, currentUser, selectedTenantId]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  if (!currentUser || !recommendations || !tenants || !products || !storeStock) {
    return <div className="p-8 text-center text-muted">Loading data...</div>;
  }

  // Filter recommendations based on mode
  const filteredRecs = (recommendations || []).filter(rec => {
    if (!rec) return false;
    // Check for null/undefined explicitly before property access
    if (mode === 'GLOBAL') return rec?.tenantId === null;
    if (mode === 'STORE') return rec?.tenantId === selectedTenantId;
    return false;
  });

  // Debugging

  // Sort by priority
  const sortedRecs = [...filteredRecs].sort((a, b) => a.priority - b.priority);

  // Helper to get stock status
  const getStock = (productId: string, tenantId: string): StockStatus => {
    const stock = storeStock.find(s => s.productId === productId && s.tenantId === tenantId);
    return stock ? stock.stockStatus : 'UNAVAILABLE';
  };

  // Preview Logic: Store Overrides Global
  const getPreviewRecs = () => {
    const storeRecs = recommendations.filter(r => r.tenantId === selectedTenantId && r.isEnabled);
    const globalRecs = recommendations.filter(r => r.tenantId === null && r.isEnabled);

    // Store configuration fully overrides if present
    const hasStoreConfig = recommendations.some(r => r.tenantId === selectedTenantId);

    if (hasStoreConfig) {
      return storeRecs.sort((a, b) => a.priority - b.priority);
    }
    return globalRecs.sort((a, b) => a.priority - b.priority);
  };

  const handleAddProduct = (product: Product) => {
    // 1. Common Validation: Must be on Global Shelf
    if (product.globalStatus === 'OFF_SHELF') {
      toast.error(t('alerts.recs.off_shelf_error'));
      return;
    }

    // 2. Store Mode Validation
    if (mode === 'STORE') {
      const stock = getStock(product.id, selectedTenantId);
      if (stock === 'UNAVAILABLE') {
        toast.error(t('alerts.recs.unavailable_error'));
        return;
      }
      if (stock === 'BACKORDER') {
        if (!confirm(t('alerts.recs.backorder_confirm'))) {
          return;
        }
      }
    }

    const newPriority = sortedRecs.length > 0 ? sortedRecs[sortedRecs.length - 1].priority + 1 : 1;

    addRecommendation({
      tenantId: mode === 'GLOBAL' ? null : selectedTenantId,
      productId: product.id,
      startAt: new Date().toISOString().split('T')[0],
      endAt: '2099-12-31',
      priority: newPriority,
      isEnabled: true,
      reason: '',
    });
    toast.success(t('alerts.recs.add_success'));
    setIsAddModalOpen(false);
  };

  const movePriority = (rec: Recommendation, direction: 'up' | 'down') => {
    const index = sortedRecs.findIndex(r => r.id === rec.id);
    if (index === -1) return;

    if (direction === 'up' && index > 0) {
      const prev = sortedRecs[index - 1];
      updateRecommendation(rec.id, { priority: prev.priority });
      updateRecommendation(prev.id, { priority: rec.priority });
    }
    if (direction === 'down' && index < sortedRecs.length - 1) {
      const next = sortedRecs[index + 1];
      updateRecommendation(rec.id, { priority: next.priority });
      updateRecommendation(next.id, { priority: rec.priority });
    }
  };

  if (mode === 'PREVIEW') {
    return (
      <RecsPreview
        recommendations={getPreviewRecs()}
        products={products}
        tenants={tenants}
        selectedTenantId={selectedTenantId}
        setSelectedTenantId={setSelectedTenantId}
        getStock={getStock}
      />
    );
  }

  return (
    <>
      <RecsList
        mode={mode}
        recommendations={sortedRecs}
        products={products}
        tenants={tenants}
        currentUserRole={currentUser.role}
        selectedTenantId={selectedTenantId}
        setSelectedTenantId={setSelectedTenantId}
        getStock={getStock}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onMovePriority={movePriority}
        onToggle={(id, val) => updateRecommendation(id, { isEnabled: val })}
        onDelete={deleteRecommendation}
      />

      <RecsProductPicker
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        products={products}
        currentRecs={sortedRecs}
        mode={mode}
        selectedTenantId={selectedTenantId}
        getStock={getStock}
        onAdd={handleAddProduct}
      />
    </>
  );
};
