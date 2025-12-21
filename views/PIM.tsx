import React, { useState, useMemo } from 'react';
import { Search, Plus, UploadCloud, Edit3, CheckSquare, Square, Trash2, ArrowUpCircle, XCircle, Filter } from 'lucide-react';
import { useApp } from '../lib/context';
import { useToast } from '../lib/toast';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { EmptyState } from '../components/common/EmptyState';
import { Product, ProductStatus } from '../types';
import { ProductEditor } from '../components/pim/ProductEditor';
import { ProductFilters } from '../components/pim/ProductFilters';
import { CSVImportModal } from '../modules/pim/components/CSVImportModal';
import { useTranslation } from 'react-i18next';

export const PIMView: React.FC = () => {
  const { products, addProduct, updateProduct, currentUser } = useApp();
  const { t } = useTranslation();
  const toast = useToast();
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Filters State
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [filterBrand, setFilterBrand] = useState<string>('ALL');

  // Selection State
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const canEdit = currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'OPS_GLOBAL';

  // Derived Options for Filters
  const { brands, categories } = useMemo(() => {
    const b = new Set<string>();
    const c = new Set<string>();
    products.forEach(p => {
      if (p.brand) b.add(p.brand);
      if (p.category) c.add(p.category);
    });
    return { brands: Array.from(b), categories: Array.from(c) };
  }, [products]);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || p.status === filterStatus;
    const matchesCategory = filterCategory === 'ALL' || p.category === filterCategory;
    const matchesBrand = filterBrand === 'ALL' || p.brand === filterBrand;

    return matchesSearch && matchesStatus && matchesCategory && matchesBrand;
  });

  // --- Batch Logic ---
  const toggleSelection = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const toggleAll = () => {
    if (selectedIds.size === filteredProducts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredProducts.map(p => p.id)));
    }
  };

  const handleBatchStatus = (status: ProductStatus) => {
    selectedIds.forEach(id => updateProduct(id, { status }));
    toast.success(t('alerts.pim.update_success'));
    setSelectedIds(new Set());
  };

  const handleBatchDelete = () => {
    if (!confirm(t('alerts.pim.delete_confirm', { count: selectedIds.size }))) return;
    selectedIds.forEach(id => updateProduct(id, { status: 'UNPUBLISHED' }));
    toast.success(t('alerts.pim.delete_success'));
    setSelectedIds(new Set());
  };

  // --- Editor Logic ---
  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsEditorOpen(true);
  };

  const handleCreate = () => {
    setSelectedProduct(null);
    setIsEditorOpen(true);
  };

  const handleSaveProduct = (productForm: Partial<Product>) => {
    if (!productForm.sku || !productForm.name) {
      toast.error(t('alerts.pim.sku_name_required'));
      return;
    }

    if (selectedProduct) {
      updateProduct(selectedProduct.id, productForm);
      toast.success(t('alerts.pim.update_success'));
    } else {
      addProduct({
        ...productForm as Product,
        imageUrl: productForm.mediaAssets?.[0]?.url || 'https://placehold.co/50',
        updatedAt: new Date().toISOString(),
        updatedBy: currentUser.id
      });
      toast.success(t('alerts.pim.create_success'));
    }
    setIsEditorOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="relative flex-1 md:max-w-md">
          <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder={t('pim.search_placeholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-brand"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-3 py-2 border rounded-lg text-sm font-medium transition-colors ${showFilters ? 'bg-gray-100 border-gray-300 text-primary' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
          >
            <Filter size={16} /> {t('common.filters')}
          </button>
          <div className="w-px h-8 bg-gray-200 mx-1"></div>
          <button
            onClick={() => setIsImportOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg"
          >
            <UploadCloud size={16} /> {t('common.import')}
          </button>
          {canEdit && (
            <button
              onClick={handleCreate}
              className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg"
            >
              <Plus size={16} /> {t('pim.new_product')}
            </button>
          )}
        </div>
      </div>

      <ProductFilters
        show={showFilters}
        filterStatus={filterStatus} setFilterStatus={setFilterStatus}
        filterCategory={filterCategory} setFilterCategory={setFilterCategory}
        filterBrand={filterBrand} setFilterBrand={setFilterBrand}
        brands={brands} categories={categories}
      />

      {/* Batch Action Bar - Uses Primary Background */}
      {selectedIds.size > 0 && canEdit && (
        <div className="bg-primary text-white px-4 py-3 rounded-lg flex items-center justify-between shadow-lg animate-in fade-in slide-in-from-bottom-2">
          <div className="text-sm font-medium pl-2">{selectedIds.size} {t('common.selected')}</div>
          <div className="flex items-center gap-3">
            <button onClick={() => setSelectedIds(new Set())} className="text-gray-400 hover:text-white text-sm mr-2">{t('common.cancel')}</button>

            <button onClick={() => handleBatchStatus('PUBLISHED')} className="flex items-center gap-1 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded text-xs font-bold">
              <ArrowUpCircle size={14} /> {t('pim.batch.publish')}
            </button>
            <button onClick={() => handleBatchStatus('UNPUBLISHED')} className="flex items-center gap-1 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded text-xs font-bold">
              <XCircle size={14} /> {t('pim.batch.unpublish')}
            </button>
            <div className="w-px h-4 bg-gray-700 mx-1"></div>
            <button onClick={handleBatchDelete} className="flex items-center gap-1 text-red-400 hover:text-red-300 px-3 py-1.5 rounded text-xs font-bold">
              <Trash2 size={14} /> {t('pim.batch.delete')}
            </button>
          </div>
        </div>
      )}

      <Card noPadding>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="py-4 px-6 w-12">
                  <button onClick={toggleAll} className="text-gray-400 hover:text-gray-600">
                    {selectedIds.size > 0 && selectedIds.size === filteredProducts.length ? <CheckSquare size={16} /> : <Square size={16} />}
                  </button>
                </th>
                <th className="py-4 px-6 w-16">{t('pim.table.img')}</th>
                <th className="py-4 px-6">{t('pim.table.info')}</th>
                <th className="py-4 px-6">{t('pim.table.category')}</th>
                <th className="py-4 px-6">{t('pim.table.status')}</th>
                <th className="py-4 px-6">{t('pim.table.rules')}</th>
                <th className="py-4 px-6 text-right">{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map(p => (
                <tr key={p.id} className={`hover:bg-gray-50/40 ${selectedIds.has(p.id) ? 'bg-brand-light/30' : ''}`}>
                  <td className="py-4 px-6">
                    <button onClick={() => toggleSelection(p.id)} className={`text-gray-400 hover:text-gray-600 ${selectedIds.has(p.id) ? 'text-brand' : ''}`}>
                      {selectedIds.has(p.id) ? <CheckSquare size={16} /> : <Square size={16} />}
                    </button>
                  </td>
                  <td className="py-4 px-6">
                    <div className="w-10 h-10 rounded bg-gray-100">
                      <img src={p.imageUrl} className="w-full h-full object-cover rounded" />
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-medium text-primary text-sm">{p.name}</div>
                    <div className="text-xs text-gray-500 font-mono">{p.sku}</div>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">{p.category}</td>
                  <td className="py-4 px-6">
                    <Badge variant={p.status === 'PUBLISHED' ? 'success' : p.status === 'DRAFT' ? 'warning' : 'neutral'}>
                      {t(`consts.status.${p.status}`)}
                    </Badge>
                  </td>
                  <td className="py-4 px-6 text-xs space-y-1">
                    <div className={p.allowBackorder ? 'text-success-text' : 'text-gray-400'}>{t('pim.table.backorder')}: {p.allowBackorder ? t('common.yes') : t('common.no')}</div>
                    <div className={p.allowTransfer ? 'text-brand' : 'text-gray-400'}>{t('pim.table.transfer')}: {p.allowTransfer ? t('common.yes') : t('common.no')}</div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button onClick={() => handleEdit(p)} className="text-gray-400 hover:text-brand"><Edit3 size={16} /></button>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={7}>
                    <EmptyState
                      onAction={() => { setSearch(''); setFilterStatus('ALL'); setFilterCategory('ALL'); }}
                      actionLabel={t('common.clear_filters')}
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <ProductEditor
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        initialData={selectedProduct}
        onSave={handleSaveProduct}
        canEdit={canEdit}
      />

      <CSVImportModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        existingSKUs={products.map(p => p.sku)}
        onImportComplete={() => {
          toast.success(t('alerts.pim.import_success', '导入成功'));
        }}
      />
    </div>
  );
};
