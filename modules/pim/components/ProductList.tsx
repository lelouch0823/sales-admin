import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../../../lib/context';
import { useToast } from '../../../lib/toast';
import { Product, ProductStatus } from '../types';
import { ProductFilters } from './ProductFilters';
import { ProductRow } from './ProductRow';
import { AnimatedBox } from '../../../components/motion'; // Import from folder index
import { Card } from '../../../components/common/Card';
import { EmptyState } from '../../../components/common/EmptyState';
import { Modal } from '../../../components/common/Modal';
import { Tooltip, TooltipProvider } from '../../../components/primitives';
import {
  Search,
  Plus,
  UploadCloud,
  CheckSquare,
  Square,
  Trash2,
  ArrowUpCircle,
  XCircle,
  Filter,
} from 'lucide-react';

interface ProductListProps {
  onCreate: () => void;
  onEdit: (product: Product) => void;
}

export function ProductList({ onCreate, onEdit }: ProductListProps) {
  const { products, updateProduct, currentUser } = useApp();
  const { t } = useTranslation();
  const toast = useToast();

  // UI 状态
  const [search, setSearch] = useState('');
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // 筛选器状态
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [filterBrand, setFilterBrand] = useState<string>('ALL');

  // 多选状态
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // 权限检查
  const canEdit = currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'OPS_GLOBAL';

  // --- 动态计算筛选选项 ---
  const { brands, categories } = useMemo(() => {
    const b = new Set<string>();
    const c = new Set<string>();
    products.forEach(p => {
      if (p.brand) b.add(p.brand);
      if (p.category) c.add(p.category);
    });
    return { brands: Array.from(b), categories: Array.from(c) };
  }, [products]);

  // --- 列表过滤逻辑 ---
  const filteredProducts = products.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || p.status === filterStatus;
    const matchesCategory = filterCategory === 'ALL' || p.category === filterCategory;
    const matchesBrand = filterBrand === 'ALL' || p.brand === filterBrand;
    return matchesSearch && matchesStatus && matchesCategory && matchesBrand;
  });

  // --- 批量操作逻辑 ---
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

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* 顶部操作栏 */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          {/* 搜索框 */}
          <div className="relative flex-1 md:max-w-md">
            <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder={t('pim.search_placeholder')}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-brand"
            />
          </div>

          {/* 功能按钮组 */}
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
                onClick={onCreate}
                className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg"
              >
                <Plus size={16} /> {t('pim.new_product')}
              </button>
            )}
          </div>
        </div>

        {/* 筛选面板组件 */}
        <ProductFilters
          show={showFilters}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
          filterBrand={filterBrand}
          setFilterBrand={setFilterBrand}
          brands={brands}
          categories={categories}
        />

        {/* 批量操作工具栏 */}
        {selectedIds.size > 0 && canEdit && (
          <AnimatedBox
            animation="fadeInUp"
            className="bg-primary text-white px-4 py-3 rounded-lg flex items-center justify-between shadow-lg"
          >
            <div className="text-sm font-medium pl-2">
              {selectedIds.size} {t('common.selected')}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedIds(new Set())}
                className="text-gray-400 hover:text-white text-sm mr-2"
              >
                {t('common.cancel')}
              </button>

              <Tooltip content={t('pim.batch.publish')}>
                <button
                  onClick={() => handleBatchStatus('PUBLISHED')}
                  className="flex items-center gap-1 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded text-xs font-bold"
                >
                  <ArrowUpCircle size={14} /> {t('pim.batch.publish')}
                </button>
              </Tooltip>
              <Tooltip content={t('pim.batch.unpublish')}>
                <button
                  onClick={() => handleBatchStatus('UNPUBLISHED')}
                  className="flex items-center gap-1 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded text-xs font-bold"
                >
                  <XCircle size={14} /> {t('pim.batch.unpublish')}
                </button>
              </Tooltip>
              <div className="w-px h-4 bg-gray-700 mx-1"></div>
              <Tooltip content={t('pim.batch.delete')}>
                <button
                  onClick={handleBatchDelete}
                  className="flex items-center gap-1 text-red-400 hover:text-red-300 px-3 py-1.5 rounded text-xs font-bold"
                >
                  <Trash2 size={14} /> {t('pim.batch.delete')}
                </button>
              </Tooltip>
            </div>
          </AnimatedBox>
        )}

        {/* 商品列表卡片 */}
        <AnimatedBox animation="fadeInUp">
          <Card noPadding>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <th className="py-4 px-6 w-12">
                      <button onClick={toggleAll} className="text-gray-400 hover:text-gray-600">
                        {selectedIds.size > 0 && selectedIds.size === filteredProducts.length ? (
                          <CheckSquare size={16} />
                        ) : (
                          <Square size={16} />
                        )}
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
                    <ProductRow
                      key={p.id}
                      product={p}
                      isSelected={selectedIds.has(p.id)}
                      onToggleSelection={toggleSelection}
                      onEdit={onEdit}
                    />
                  ))}
                  {filteredProducts.length === 0 && (
                    <tr>
                      <td colSpan={7}>
                        <EmptyState
                          onAction={() => {
                            setSearch('');
                            setFilterStatus('ALL');
                            setFilterCategory('ALL');
                          }}
                          actionLabel={t('common.clear_filters')}
                        />
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </AnimatedBox>

        {/* 导入模态框 */}
        <Modal isOpen={isImportOpen} onClose={() => setIsImportOpen(false)} className="max-w-lg">
          <div className="p-6 text-center">
            <UploadCloud size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-bold mb-2 text-primary">{t('pim.import_modal.title')}</h3>
            <p className="text-sm text-gray-500 mb-6">{t('pim.import_modal.desc')}</p>

            <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 mb-4 bg-gray-50">
              <button className="text-brand font-medium text-sm hover:underline">
                {t('pim.import_modal.download_template')}
              </button>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsImportOpen(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={() => {
                  toast.info(t('alerts.pim.mock_import'));
                  setIsImportOpen(false);
                }}
                className="px-4 py-2 text-sm bg-primary text-white rounded-lg shadow-sm hover:bg-primary-hover"
              >
                {t('pim.import_modal.start')}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </TooltipProvider>
  );
}
