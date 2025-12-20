import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { Modal } from '../../../components/common/Modal';
import { useTranslation } from 'react-i18next';
import { InfoTab } from './editor/InfoTab';
import { PriceTab } from './editor/PriceTab';
import { MediaTab } from './editor/MediaTab';
import { Button } from '../../../components/ui';
import { useZodForm, FormProvider } from '../../../hooks/useZodForm';
import { productSchema, ProductFormData } from '../../../lib/schemas';

interface ProductEditorProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: Product | null; // null 表示创建模式，否则为编辑模式
  onSave: (product: Partial<Product>) => void;
  canEdit: boolean; // 权限控制：是否允许保存
}

/**
 * 商品编辑器组件 (ProductEditor)
 * 职责:
 * 1. 提供商品创建和编辑的模态框容器
 * 2. 管理表单的暂存状态 (使用 useZodForm)
 * 3. 协调三个子 Tab (Info, Price, Media) 的渲染
 * 4. 处理最终的保存逻辑
 */
export const ProductEditor: React.FC<ProductEditorProps> = ({ isOpen, onClose, initialData, onSave, canEdit }) => {
  const { t } = useTranslation();

  // UI 状态
  const [editTab, setEditTab] = useState<'INFO' | 'PRICE' | 'MEDIA'>('INFO');

  const form = useZodForm<ProductFormData>({
    schema: productSchema,
    defaultValues: {
      sku: '',
      name: '',
      brand: '',
      category: '',
      description: '',
      price: 0,
      status: 'DRAFT',
      tags: [],
      mediaAssets: [],
      allowBackorder: false,
      allowTransfer: false
    }
  });

  // 初始化逻辑：当 Modal 打开或 initialData 变化时重置表单
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        form.reset({
          ...initialData,
          // Ensure array fields are arrays
          tags: initialData.tags || [],
          // mediaAssets type
          mediaAssets: initialData.mediaAssets || []
        });
      } else {
        form.reset({
          sku: '', name: '', brand: '', category: '', description: '', price: 0,
          status: 'DRAFT',
          // schema field
          mediaAssets: [],
          tags: [],
          // schema field
          allowBackorder: false,
          // schema field
          allowTransfer: false
        });
      }
      setEditTab('INFO'); // 默认打开第一个 Tab
    }
  }, [isOpen, initialData, form]);

  const onSubmit = (data: any) => {
    // partial type match
    onSave(data);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? t('pim.editor.title_edit') : t('pim.editor.title_create')}
      className="max-w-2xl h-[90vh]"
      noPadding
    >
      <FormProvider {...form}>
        <div className="flex flex-col h-full">
          {/* Tab 导航栏 */}
          <div className="flex border-b bg-white px-6 shrink-0">
            {['info', 'price', 'media'].map(tabKey => (
              <button
                key={tabKey}
                onClick={() => setEditTab(tabKey.toUpperCase() as any)}
                className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors uppercase ${editTab === tabKey.toUpperCase() ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-400'}`}
              >
                {t(`pim.editor.tabs.${tabKey}`)}
              </button>
            ))}
          </div>

          {/* 表单内容区域 (根据 Tab 切换渲染子组件) */}
          <div className="p-6 flex-1 overflow-y-auto">
            {editTab === 'INFO' && <InfoTab isEditMode={!!initialData} />}
            {editTab === 'PRICE' && <PriceTab />}
            {editTab === 'MEDIA' && <MediaTab />}
          </div>

          {/* 底部操作栏 */}
          <div className="p-4 border-t bg-gray-50 flex justify-end gap-3 shrink-0">
            <Button variant="secondary" onClick={onClose}>{t('common.cancel')}</Button>
            {canEdit && (
              <Button variant="primary" onClick={form.handleSubmit(onSubmit)}>
                {initialData ? t('common.save_changes') : t('common.create')}
              </Button>
            )}
          </div>
        </div>
      </FormProvider>
    </Modal>
  );
};