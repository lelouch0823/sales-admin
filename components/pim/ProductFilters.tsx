import React from 'react';
import { useTranslation } from 'react-i18next';
import { Select } from '../ui';

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

  const statusOptions = [
    { value: 'ALL', label: t('pim.filters.all_statuses') },
    { value: 'PUBLISHED', label: t('consts.status.PUBLISHED') },
    { value: 'DRAFT', label: t('consts.status.DRAFT') },
    { value: 'UNPUBLISHED', label: t('consts.status.UNPUBLISHED') },
  ];

  const categoryOptions = [
    { value: 'ALL', label: t('pim.filters.all_categories') },
    ...categories.map(c => ({ value: c, label: c }))
  ];

  const brandOptions = [
    { value: 'ALL', label: t('pim.filters.all_brands') },
    ...brands.map(b => ({ value: b, label: b }))
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 grid grid-cols-1 md:grid-cols-3 gap-4 shadow-sm animate-in slide-in-from-top-2">
      <Select
        label={t('pim.filters.status_label')}
        options={statusOptions}
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
      />
      <Select
        label={t('pim.filters.category_label')}
        options={categoryOptions}
        value={filterCategory}
        onChange={(e) => setFilterCategory(e.target.value)}
      />
      <Select
        label={t('pim.filters.brand_label')}
        options={brandOptions}
        value={filterBrand}
        onChange={(e) => setFilterBrand(e.target.value)}
      />
    </div>
  );
};