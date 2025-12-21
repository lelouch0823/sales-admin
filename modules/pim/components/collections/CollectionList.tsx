import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApiQuery } from '../../../../hooks/useApiQuery';
import { collectionApi } from '../../../collections/api';
import { Collection } from '../../../collections/types';
import { AnimatedBox } from '../../../../components/motion';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { formatDate } from '../../../../utils/date';

interface CollectionListProps {
  onEdit: (collection: Collection) => void;
  onCreate: () => void;
}

export function CollectionList({ onEdit, onCreate }: CollectionListProps) {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');

  const {
    data: collections,
    isLoading,
    refetch,
  } = useApiQuery<Collection[]>({
    queryKey: ['collections'],
    queryFn: () => collectionApi.list(),
  });

  const handleDelete = async (id: string) => {
    if (confirm(t('confirmDelete'))) {
      try {
        await collectionApi.delete(id);
        refetch();
      } catch (error) {
        console.error('Failed to delete collection', error);
      }
    }
  };

  const filteredCollections =
    collections?.filter(c => c.name.toLowerCase().includes(search.toLowerCase())) || [];

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
            placeholder={t('searchCollections')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button onClick={onCreate}>
          <Plus size={16} className="mr-2" />
          {t('addCollection')}
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
            {filteredCollections.map(collection => (
              <tr key={collection.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{collection.name}</div>
                  <div className="text-xs text-gray-500">
                    {collection.brand?.name || 'No Brand'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      collection.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {collection.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(collection.createdAt || '')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onEdit(collection)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(collection.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredCollections.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  {t('noCollectionsFound')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AnimatedBox>
  );
}
