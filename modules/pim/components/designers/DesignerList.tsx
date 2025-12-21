import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApiQuery } from '../../../../hooks/useApiQuery';
import { designerApi } from '../../../designers/api';
import { Designer } from '../../../designers/types';
import { AnimatedBox } from '../../../../components/motion';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { formatDate } from '../../../../utils/date';

interface DesignerListProps {
  onEdit: (designer: Designer) => void;
  onCreate: () => void;
}

export function DesignerList({ onEdit, onCreate }: DesignerListProps) {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');

  const {
    data: designers,
    isLoading,
    refetch,
  } = useApiQuery<Designer[]>({
    queryKey: ['designers'],
    queryFn: () => designerApi.list(),
  });

  const handleDelete = async (id: string) => {
    if (confirm(t('confirmDelete'))) {
      try {
        await designerApi.delete(id);
        refetch();
      } catch (error) {
        console.error('Failed to delete designer', error);
      }
    }
  };

  const filteredDesigners =
    designers?.filter(d => d.name.toLowerCase().includes(search.toLowerCase())) || [];

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
            placeholder={t('searchDesigners')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button onClick={onCreate}>
          <Plus size={16} className="mr-2" />
          {t('addDesigner')}
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
            {filteredDesigners.map(designer => (
              <tr key={designer.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">
                        {designer.name.charAt(0)}
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{designer.name}</div>
                      <div className="text-xs text-gray-500">{designer.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      designer.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {designer.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(designer.createdAt || '')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onEdit(designer)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(designer.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredDesigners.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  {t('noDesignersFound')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AnimatedBox>
  );
}
