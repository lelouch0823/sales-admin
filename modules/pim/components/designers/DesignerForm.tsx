import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { designerApi } from '../../../designers/api';
import { Designer } from '../../../designers/types';
import { useZodForm } from '../../../../hooks/useZodForm';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { Textarea } from '../../../../components/ui/Textarea';
import { Select } from '../../../../components/ui/Select';
import { X, Save } from 'lucide-react';
import { toast } from 'react-hot-toast';

// 设计师表单验证 Schema
const designerSchema = z.object({
  name: z.string().min(1, '设计师名称必填').max(100, '名称最多100个字符'),
  email: z.string().email('请输入有效的邮箱地址').optional().or(z.literal('')),
  bio: z.string().max(1000, '简介最多1000个字符').optional(),
  status: z.enum(['active', 'inactive']),
});

type DesignerFormData = z.infer<typeof designerSchema>;

interface DesignerFormProps {
  initialData?: Designer;
  onSave: () => void;
  onCancel: () => void;
}

/**
 * 设计师编辑表单
 *
 * 优化点：
 * - 使用 useZodForm 进行表单验证
 * - 邮箱格式自动验证
 * - 统一的错误显示和 API 调用处理
 */
export function DesignerForm({ initialData, onSave, onCancel }: DesignerFormProps) {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useZodForm<DesignerFormData>({
    schema: designerSchema,
    defaultValues: {
      name: '',
      email: '',
      bio: '',
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
        email: initialData.email || '',
        bio: initialData.bio || '',
        status: (initialData.status as 'active' | 'inactive') || 'active',
      });
    }
  }, [initialData, reset]);

  // 提交表单
  const onSubmit = async (data: DesignerFormData) => {
    try {
      if (initialData?.id) {
        await designerApi.update(initialData.id, data);
        toast.success(t('designerUpdated'));
      } else {
        await designerApi.create(data as Parameters<typeof designerApi.create>[0]);
        toast.success(t('designerCreated'));
      }
      onSave();
    } catch (error) {
      console.error('Failed to save designer', error);
      toast.error(t('saveFailed'));
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold">
          {initialData ? t('editDesigner') : t('createDesigner')}
        </h2>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
          <X size={20} />
        </button>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit as unknown as Parameters<typeof handleSubmit>[0])}
        className="space-y-4"
      >
        {/* 设计师名称 */}
        <Input
          {...register('name')}
          label={t('name')}
          placeholder={t('enterDesignerName')}
          error={errors.name?.message}
        />

        {/* 邮箱 */}
        <Input
          {...register('email')}
          label={t('email')}
          type="email"
          placeholder="designer@example.com"
          error={errors.email?.message}
        />

        {/* 简介 */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t('bio')}</label>
          <Textarea {...register('bio')} placeholder={t('enterBio')} rows={4} />
          {errors.bio && <p className="mt-1 text-xs text-danger">{errors.bio.message}</p>}
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
