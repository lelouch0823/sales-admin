import React from 'react';
import { useTranslation } from 'react-i18next';

interface ProductFiltersProps {
  show: boolean;
  filterStatus: string;
  setFilterStatus: (val: string) => void;
  filterCategory: string;
  setFilterCategory: (val: string) => void;
  filterBrand: string;
  setFilterBrand: (val: string) => void;
  brands: string[];
  categories: string[];
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  show,
  filterStatus, setFilterStatus,
  filterCategory, setFilterCategory,
  filterBrand, setFilterBrand,
  brands, categories
}) => {
  const { t } = useTranslation();

  if (!show) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 grid grid-cols-1 md:grid-cols-3 gap-4 shadow-sm animate-in slide-in-from-top-2">
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t('pim.filters.status_label')}</label>
        <select 
           value={filterStatus} 
           onChange={(e) => setFilterStatus(e.target.value)}
           className="w-full border border-gray-200 rounded p-2 text-sm outline-none focus:border-blue-500"
        >
            <option value="ALL">{t('pim.filters.all_statuses')}</option>
            <option value="PUBLISHED">{t('consts.status.PUBLISHED')}</option>
            <option value="DRAFT">{t('consts.status.DRAFT')}</option>
            <option value="UNPUBLISHED">{t('consts.status.UNPUBLISHED')}</option>
        </select>
      </div>
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t('pim.filters.category_label')}</label>
        <select 
           value={filterCategory} 
           onChange={(e) => setFilterCategory(e.target.value)}
           className="w-full border border-gray-200 rounded p-2 text-sm outline-none focus:border-blue-500"
        >
            <option value="ALL">{t('pim.filters.all_categories')}</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t('pim.filters.brand_label')}</label>
        <select 
           value={filterBrand} 
           onChange={(e) => setFilterBrand(e.target.value)}
           className="w-full border border-gray-200 rounded p-2 text-sm outline-none focus:border-blue-500"
        >
            <option value="ALL">{t('pim.filters.all_brands')}</option>
            {brands.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
      </div>
    </div>
  );
};