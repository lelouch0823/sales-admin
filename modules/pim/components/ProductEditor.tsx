import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Product } from '../types';
import { AnimatedBox } from '../../../components/motion';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Save, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useApp } from '../../../lib/context';

interface ProductEditorProps {
  initialData?: Product;
  onClose: () => void;
  // Kept for compatibility if used elsewhere, but optional
  isOpen?: boolean;
  onSave?: (product: Partial<Product>) => void;
  canEdit?: boolean;
}

export function ProductEditor({ initialData, onClose }: ProductEditorProps) {
  const { t } = useTranslation();
  const { addProduct, updateProduct, currentUser } = useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<Partial<Product>>({
    sku: '',
    name: '',
    category: '',
    brand: '',
    price: 0,
    description: '',
    status: 'DRAFT',
    tags: [],
    mediaAssets: [],
    allowBackorder: false,
    allowTransfer: true,
    globalStatus: 'OFF_SHELF',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!formData.name || !formData.sku) {
        toast.error(t('alerts.pim.sku_name_required'));
        return;
      }

      if (initialData?.id) {
        updateProduct(initialData.id, formData);
        toast.success(t('alerts.pim.update_success'));
      } else {
        // Mock ID generation for now, real app would let backend handle it
        const newProduct = {
          tags: [],
          mediaAssets: [],
          allowBackorder: false,
          allowTransfer: true,
          globalStatus: 'OFF_SHELF',
          ...formData,
          id: Math.random().toString(36).substr(2, 9),
          imageUrl: 'https://placehold.co/50',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          updatedBy: currentUser.id,
        } as Product;

        addProduct(newProduct);
        toast.success(t('alerts.pim.create_success'));
      }
      onClose();
    } catch (error) {
      console.error('Failed to save product', error);
      toast.error(t('saveFailed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatedBox className="bg-white rounded-lg border border-gray-100 shadow-sm h-full flex flex-col">
      <div className="flex justify-between items-center p-6 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-500" />
          </button>
          <h2 className="text-xl font-bold">
            {initialData ? t('editProduct') : t('createProduct')}
          </h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <form id="product-form" onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('pim.table.sku')}
              </label>
              <Input
                required
                value={formData.sku}
                onChange={e => setFormData({ ...formData, sku: e.target.value })}
                placeholder="SKU-12345"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('pim.table.info')}
              </label>
              <Input
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder={t('pim.enter_product_name')}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('pim.table.category')}
              </label>
              <Input
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                placeholder="Category"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('brands')}</label>
              <Input
                value={formData.brand}
                onChange={e => setFormData({ ...formData, brand: e.target.value })}
                placeholder="Brand"
              />
            </div>
          </div>

          {/* Price row (Stock removed) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('price')}</label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })}
              />
            </div>
            {/* Empty div to keep grid alignment or just remove grid if single item? keeping grid for future extension */}
            <div></div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('description')}
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none min-h-[150px]"
              value={formData.description || ''}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder={t('enterDescription')}
            />
          </div>
        </form>
      </div>

      <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-lg">
        <Button type="button" variant="secondary" onClick={onClose}>
          {t('cancel')}
        </Button>
        <Button type="submit" form="product-form" disabled={isSubmitting}>
          <Save size={16} className="mr-2" />
          {isSubmitting ? t('saving') : t('save')}
        </Button>
      </div>
    </AnimatedBox>
  );
}
