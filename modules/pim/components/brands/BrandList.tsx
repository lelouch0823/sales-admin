import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useApiQuery } from '../../../../hooks/useApiQuery';
import { brandApi } from '../../../brands/api';
import { Brand } from '../../../brands/types';
import { AnimatedBox } from '../../../../components/motion';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { DataTable, Column } from '../../../../components/common/DataTable';
import { Badge } from '../../../../components/common/Badge';
import { ConfirmDialog } from '../../../../components/common/ConfirmDialog';
import { Tooltip } from '../../../../components/primitives';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { formatDate } from '../../../../utils/date';

interface BrandListProps {
  onEdit: (brand: Brand) => void;
  onCreate: () => void;
}

/**
 * 品牌列表组件
 *
 * 优化点：
 * - 使用 DataTable 组件，自动支持骨架屏加载和空状态
 * - 使用 Badge 组件显示状态，保持 UI 一致性
 * - 使用 Tooltip 组件为操作按钮提供提示
 */
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

  // 处理删除操作
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

  // 过滤数据
  const filteredBrands = useMemo(() => {
    if (!brands) return [];
    if (!search) return brands;
    return brands.filter(brand => brand.name.toLowerCase().includes(search.toLowerCase()));
  }, [brands, search]);

  // 表格列定义
  const columns: Column<Brand>[] = useMemo(
    () => [
      {
        key: 'name',
        header: t('name'),
        sortable: true,
        render: (_, brand) => (
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
                  onClick={e => e.stopPropagation()}
                >
                  {brand.websiteUrl}
                </a>
              )}
            </div>
          </div>
        ),
      },
      {
        key: 'description',
        header: t('description'),
        render: (_, brand) => (
          <div className="text-sm text-gray-500 truncate max-w-xs">{brand.description || '-'}</div>
        ),
      },
      {
        key: 'isActive',
        header: t('status'),
        render: (_, brand) => (
          <Badge variant={brand.isActive ? 'success' : 'neutral'}>
            {brand.isActive ? t('active') : t('inactive')}
          </Badge>
        ),
      },
      {
        key: 'createdAt',
        header: t('createdAt'),
        sortable: true,
        render: (_, brand) => (
          <span className="text-sm text-gray-500">{formatDate(brand.createdAt || '')}</span>
        ),
      },
      {
        key: 'actions',
        header: t('actions'),
        align: 'right',
        render: (_, brand) => (
          <div className="flex justify-end gap-2" onClick={e => e.stopPropagation()}>
            <Tooltip content={t('edit')}>
              <button
                onClick={() => onEdit(brand)}
                className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50 transition-colors"
              >
                <Edit size={16} />
              </button>
            </Tooltip>
            <Tooltip content={t('delete')}>
              <button
                onClick={() => setDeleteId(brand.id)}
                className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </Tooltip>
          </div>
        ),
      },
    ],
    [t, onEdit]
  );

  return (
    <AnimatedBox className="space-y-4">
      {/* 工具栏 */}
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

      {/* 数据表格 - 使用 DataTable 组件 */}
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
        <DataTable
          columns={columns}
          data={filteredBrands}
          rowKey="id"
          loading={isLoading}
          emptyText={t('noBrandsFound')}
          onRowClick={onEdit}
        />
      </div>

      {/* 删除确认弹窗 */}
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
