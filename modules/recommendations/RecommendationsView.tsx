import React, { useState } from 'react';
import { useApp } from '../../lib/context';
import { useToast } from '../../lib/toast';
import { Recommendation } from './types';
import { Product, StockStatus } from '../../types'; // Cross-domain reference
import { RecsPreview } from './components/RecsPreview';
import { RecsList } from './components/RecsList';
import { RecsProductPicker } from './components/RecsProductPicker';
import { useTranslation } from 'react-i18next';

interface RecsViewProps {
  // 模式：全局配置 / 门店配置 / 效果预览
  mode: 'GLOBAL' | 'STORE' | 'PREVIEW';
}

/**
 * 今日推荐配置视图 (RecommendationsView)
 * 职责:
 * 1. 管理 App 首页 "今日推荐" 栏目的商品列表
 * 2. 支持 Global (全局) 和 Store (门店) 两级配置
 * 3. 实现 "门店配置覆盖全局配置" 的业务逻辑
 * 4. 提供 "Preview" 模式，模拟 App 端看到的最终结果
 */
export const RecommendationsView: React.FC<RecsViewProps> = ({ mode }) => {
  const { 
    tenants, 
    currentUser, 
    recommendations, 
    products, 
    storeStock,
    addRecommendation, 
    updateRecommendation, 
    deleteRecommendation 
  } = useApp();
  const { t } = useTranslation();
  const toast = useToast();

  // 当前选中的租户 (仅在 STORE/PREVIEW 模式下有效)
  const [selectedTenantId, setSelectedTenantId] = useState<string>(
    mode === 'STORE' || mode === 'PREVIEW' ? (currentUser.tenantId || tenants[1].id) : ''
  );
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // --- 1. 列表过滤与排序 ---
  // 根据当前模式过滤推荐项
  const filteredRecs = recommendations.filter(rec => {
    if (mode === 'GLOBAL') return rec.tenantId === null; // 全局配置: tenantId 为空
    if (mode === 'STORE') return rec.tenantId === selectedTenantId; // 门店配置: tenantId 匹配
    return false;
  });

  // 按 priority 升序排列 (1, 2, 3...)
  const sortedRecs = [...filteredRecs].sort((a, b) => a.priority - b.priority);

  // 辅助方法: 获取商品在当前门店的库存状态 (用于判断是否可推荐)
  const getStock = (productId: string, tenantId: string): StockStatus => {
    const stock = storeStock.find(s => s.productId === productId && s.tenantId === tenantId);
    return stock ? stock.stockStatus : 'UNAVAILABLE';
  };

  // --- 2. 预览逻辑 (Preview Logic) ---
  // 核心规则: 如果门店有配置，则完全忽略全局配置 (Override); 否则使用全局配置
  const getPreviewRecs = () => {
    const storeRecs = recommendations.filter(r => r.tenantId === selectedTenantId && r.isEnabled);
    const globalRecs = recommendations.filter(r => r.tenantId === null && r.isEnabled);
    
    const hasStoreConfig = recommendations.some(r => r.tenantId === selectedTenantId);
    
    if (hasStoreConfig) {
      return storeRecs.sort((a, b) => a.priority - b.priority);
    }
    return globalRecs.sort((a, b) => a.priority - b.priority);
  };

  // --- 3. 添加商品逻辑 ---
  const handleAddProduct = (product: Product) => {
    // 校验 1: 商品必须全局上架
    if (product.globalStatus === 'OFF_SHELF') {
      toast.error(t('alerts.recs.off_shelf_error'));
      return;
    }

    // 校验 2: 门店模式下，商品必须可售 (或可预订)
    if (mode === 'STORE') {
      const stock = getStock(product.id, selectedTenantId);
      if (stock === 'UNAVAILABLE') {
        toast.error(t('alerts.recs.unavailable_error'));
        return;
      }
      if (stock === 'BACKORDER') {
        // 允许添加缺货但可预订的商品，但给出提示
        if (!confirm(t('alerts.recs.backorder_confirm'))) {
          return;
        }
      }
    }

    // 计算新优先级 (添加到末尾)
    const newPriority = sortedRecs.length > 0 ? sortedRecs[sortedRecs.length - 1].priority + 1 : 1;
    
    addRecommendation({
      tenantId: mode === 'GLOBAL' ? null : selectedTenantId,
      productId: product.id,
      startAt: new Date().toISOString().split('T')[0], // 默认今天开始
      endAt: '2099-12-31', // 默认永久
      priority: newPriority,
      isEnabled: true,
      reason: ''
    });
    toast.success(t('alerts.recs.add_success'));
    setIsAddModalOpen(false);
  };

  // --- 4. 排序逻辑 ---
  const movePriority = (rec: Recommendation, direction: 'up' | 'down') => {
    const index = sortedRecs.findIndex(r => r.id === rec.id);
    if (index === -1) return;
    
    // 交换相邻两项的 priority
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

  // --- 5. 渲染 ---
  
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
      
      {/* 商品选择器模态框 */}
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