import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { collectionApi } from '../../../collections/api';
import { Collection } from '../../../collections/types';
import { useZodForm } from '../../../../hooks/useZodForm';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { Textarea } from '../../../../components/ui/Textarea';
import { Select } from '../../../../components/ui/Select';
import { X, Save } from 'lucide-react';
import { toast } from 'react-hot-toast';

// 系列表单验证 Schema
const collectionSchema = z.object({
  name: z.string().min(1, '系列名称必填').max(100, '名称最多100个字符'),
  description: z.string().max(500, '描述最多500个字符').optional(),
  status: z.enum(['active', 'inactive']),
});

type CollectionFormData = z.infer<typeof collectionSchema>;

interface CollectionFormProps {
  initialData?: Collection;
  onSave: () => void;
  onCancel: () => void;
}

/**
 * 系列编辑表单
 *
 * 优化点：
 * - 使用 useZodForm 进行表单验证
 * - 使用 Select 组件的 options 属性
 * - 统一的错误显示和 API 调用处理
 */
export function CollectionForm({ initialData, onSave, onCancel }: CollectionFormProps) {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useZodForm<CollectionFormData>({
    schema: collectionSchema,
    defaultValues: {
      name: '',
      description: '',
      status: 'active' as const,
    },
  });

  // 状态选项
  const statusOptions = useMemo(
    () => [
      { value: 'active', label: t('active') },
      { value: 'inactive', label: t('inactive') },
    ],
    [t]
  );

  // 当有初始数据时，填充表单
  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || '',
        description: initialData.description || '',
        status: (initialData.status as 'active' | 'inactive') || 'active',
      });
    }
  }, [initialData, reset]);

  // 提交表单
  const onSubmit = async (data: CollectionFormData) => {
    try {
      if (initialData?.id) {
        await collectionApi.update(initialData.id, data);
        toast.success(t('collectionUpdated'));
      } else {
        await collectionApi.create(data as Parameters<typeof collectionApi.create>[0]);
        toast.success(t('collectionCreated'));
      }
      onSave();
    } catch (error) {
      console.error('Failed to save collection', error);
      toast.error(t('saveFailed'));
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold">
          {initialData ? t('editCollection') : t('createCollection')}
        </h2>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
          <X size={20} />
        </button>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit as unknown as Parameters<typeof handleSubmit>[0])}
        className="space-y-4"
      >
        {/* 系列名称 */}
        <Input
          {...register('name')}
          label={t('name')}
          placeholder={t('enterCollectionName')}
          error={errors.name?.message}
        />

        {/* 描述 */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
            {t('description')}
          </label>
          <Textarea {...register('description')} placeholder={t('enterDescription')} rows={4} />
          {errors.description && (
            <p className="mt-1 text-xs text-danger">{errors.description.message}</p>
          )}
        </div>

        {/* 状态 */}
        <Select {...register('status')} label={t('status')} options={statusOptions} />

        {/* 操作按钮 */}
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={onCancel}>
            {t('cancel')}
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            <Save size={16} className="mr-2" />
            {isSubmitting ? t('saving') : t('save')}
          </Button>
        </div>
      </form>
    </div>
  );
}
