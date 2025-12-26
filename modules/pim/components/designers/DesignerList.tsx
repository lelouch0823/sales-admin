import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useApiQuery } from '../../../../hooks/useApiQuery';
import { designerApi } from '../../../designers/api';
import { Designer } from '../../../designers/types';
import { AnimatedBox } from '../../../../components/motion';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { Avatar } from '../../../../components/ui/Avatar';
import { DataTable, Column } from '../../../../components/common/DataTable';
import { Badge } from '../../../../components/common/Badge';
import { ConfirmDialog } from '../../../../components/common/ConfirmDialog';
import { Tooltip } from '../../../../components/primitives';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { formatDate } from '../../../../utils/date';

interface DesignerListProps {
  onEdit: (designer: Designer) => void;
  onCreate: () => void;
}

/**
 * 设计师列表组件
 *
 * 优化点：
 * - 使用 DataTable 组件，自动支持骨架屏加载和空状态
 * - 使用 Badge 组件显示状态，保持 UI 一致性
 * - 使用 Tooltip 组件为操作按钮提供提示
 * - 使用 Avatar 组件显示设计师头像
 */
export function DesignerList({ onEdit, onCreate }: DesignerListProps) {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const {
    data: designers,
    isLoading,
    refetch,
  } = useApiQuery<Designer[]>({
    queryKey: ['designers'],
    queryFn: () => designerApi.list(),
  });

  // 处理删除操作
  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await designerApi.delete(deleteId);
      refetch();
    } catch (error) {
      console.error('Failed to delete designer', error);
    } finally {
      setDeleteId(null);
    }
  };

  // 过滤数据
  const filteredDesigners = useMemo(() => {
    if (!designers) return [];
    if (!search) return designers;
    return designers.filter(d => d.name.toLowerCase().includes(search.toLowerCase()));
  }, [designers, search]);

  // 表格列定义
  const columns: Column<Designer>[] = useMemo(
    () => [
      {
        key: 'name',
        header: t('name'),
        sortable: true,
        render: (_, designer) => (
          <div className="flex items-center">
            <Avatar name={designer.name} size="md" />
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-900">{designer.name}</div>
              <div className="text-xs text-gray-500">{designer.email}</div>
            </div>
          </div>
        ),
      },
      {
        key: 'status',
        header: t('status'),
        render: (_, designer) => (
          <Badge variant={designer.status === 'active' ? 'success' : 'neutral'}>
            {designer.status}
          </Badge>
        ),
      },
      {
        key: 'createdAt',
        header: t('createdAt'),
        sortable: true,
        render: (_, designer) => (
          <span className="text-sm text-gray-500">{formatDate(designer.createdAt || '')}</span>
        ),
      },
      {
        key: 'actions',
        header: t('actions'),
        align: 'right',
        render: (_, designer) => (
          <div className="flex justify-end gap-2" onClick={e => e.stopPropagation()}>
            <Tooltip content={t('edit')}>
              <button
                onClick={() => onEdit(designer)}
                className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50 transition-colors"
              >
                <Edit size={16} />
              </button>
            </Tooltip>
            <Tooltip content={t('delete')}>
              <button
                onClick={() => setDeleteId(designer.id)}
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

      {/* 数据表格 */}
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
        <DataTable
          columns={columns}
          data={filteredDesigners}
          rowKey="id"
          loading={isLoading}
          emptyText={t('noDesignersFound')}
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
