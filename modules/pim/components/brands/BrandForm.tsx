import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { brandApi } from '../../../brands/api';
import { Brand } from '../../../brands/types';
import { useZodForm } from '../../../../hooks/useZodForm';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { Textarea } from '../../../../components/ui/Textarea';
import { X, Save, Upload } from 'lucide-react';
import { toast } from 'react-hot-toast';

// 品牌表单验证 Schema
const brandSchema = z.object({
  name: z.string().min(1, '品牌名称必填').max(100, '名称最多100个字符'),
  description: z.string().max(500, '描述最多500个字符').optional(),
  websiteUrl: z.string().url('请输入有效的网址').optional().or(z.literal('')),
  isActive: z.boolean(),
});

type BrandFormData = z.infer<typeof brandSchema>;

interface BrandFormProps {
  initialData?: Brand;
  onSave: () => void;
  onCancel: () => void;
}

/**
 * 品牌编辑表单
 *
 * 优化点：
 * - 使用 useZodForm 进行表单验证，提供即时错误反馈
 * - 使用 Textarea 组件替代原生 textarea
 * - 统一的 API 调用错误处理
 */
export function BrandForm({ initialData, onSave, onCancel }: BrandFormProps) {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useZodForm<BrandFormData>({
    schema: brandSchema,
    defaultValues: {
      name: '',
      description: '',
      websiteUrl: '',
      isActive: true,
    },
  });

  // 当有初始数据时，填充表单
  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || '',
        description: initialData.description || '',
        websiteUrl: initialData.websiteUrl || '',
        isActive: initialData.isActive ?? true,
      });
    }
  }, [initialData, reset]);

  // 提交表单
  const onSubmit = async (data: BrandFormData) => {
    try {
      if (initialData?.id) {
        await brandApi.update(initialData.id, data);
        toast.success(t('brandUpdated'));
      } else {
        await brandApi.create(data as Parameters<typeof brandApi.create>[0]);
        toast.success(t('brandCreated'));
      }
      onSave();
    } catch (error) {
      console.error('Failed to save brand', error);
      toast.error(t('saveFailed'));
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold">{initialData ? t('editBrand') : t('createBrand')}</h2>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
          <X size={20} />
        </button>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit as unknown as Parameters<typeof handleSubmit>[0])}
        className="space-y-4"
      >
        {/* Logo 上传占位 */}
        <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 cursor-pointer transition-colors">
          <Upload size={24} className="mb-2" />
          <span className="text-sm">{t('uploadLogo')}</span>
        </div>

        {/* 品牌名称 */}
        <Input
          {...register('name')}
          label={t('name')}
          placeholder={t('enterBrandName')}
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

        {/* 网站地址 */}
        <Input
          {...register('websiteUrl')}
          label={t('website')}
          type="url"
          placeholder="https://example.com"
          error={errors.websiteUrl?.message}
        />

        {/* 状态 */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isActive"
            {...register('isActive')}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="isActive" className="text-sm text-gray-700">
            {t('active')}
          </label>
        </div>

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
