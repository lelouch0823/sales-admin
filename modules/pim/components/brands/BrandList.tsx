import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApiQuery } from '../../../../hooks/useApiQuery';
import { brandApi } from '../../../brands/api';
import { Brand } from '../../../brands/types';
import { AnimatedBox } from '../../../../components/motion';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { ConfirmDialog } from '../../../../components/common/ConfirmDialog';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { formatDate } from '../../../../utils/date';

interface BrandListProps {
  onEdit: (brand: Brand) => void;
  onCreate: () => void;
}

export function BrandList({ onEdit, onCreate }: BrandListProps) {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const {
    data: brands,
    isLoading,
    refetch,
  } = useApiQuery<Brand[]>({
    queryKey: ['brands'],
    queryFn: () => brandApi.list(),
  });

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await brandApi.delete(deleteId);
      refetch();
    } catch (error) {
      console.error('Failed to delete brand', error);
    } finally {
      setDeleteId(null);
    }
  };

  const filteredBrands =
    brands?.filter(brand => brand.name.toLowerCase().includes(search.toLowerCase())) || [];

  if (isLoading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <AnimatedBox className="space-y-4">
      <div className="flex justify-between items-center bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
        <div className="relative w-72">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={16}
          />
          <Input
            placeholder={t('searchBrands')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button onClick={onCreate}>
          <Plus size={16} className="mr-2" />
          {t('addBrand')}
        </Button>
      </div>

      <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('name')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('description')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('status')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('createdAt')}
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('actions')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredBrands.map(brand => (
              <tr key={brand.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      {brand.logoUrl ? (
                        <img
                          className="h-10 w-10 rounded-full object-cover bg-gray-100"
                          src={brand.logoUrl}
                          alt={brand.name}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                          {brand.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{brand.name}</div>
                      {brand.websiteUrl && (
                        <a
                          href={brand.websiteUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-blue-500 hover:underline"
                        >
                          {brand.websiteUrl}
                        </a>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-500 truncate max-w-xs">
                    {brand.description || '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      brand.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {brand.isActive ? t('active') : t('inactive')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(brand.createdAt || '')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onEdit(brand)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => setDeleteId(brand.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredBrands.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  {t('noBrandsFound')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={open => !open && setDeleteId(null)}
        title={t('confirmDelete')}
        description={t('deleteConfirmMessage')}
        variant="danger"
        confirmText={t('delete')}
        onConfirm={handleDelete}
      />
    </AnimatedBox>
  );
}
